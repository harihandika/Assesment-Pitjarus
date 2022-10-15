const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var moment = require("moment");

module.exports = async (params, options) => {
    let searchStr,
        pagination,
        column,
        order,
        index,
        attributes,
        search,
        datatableObj,
        query;

    const onColumn = options && options.onColumn ? options.onColumn : null;
    const onColumnField = onColumn ? _.map(onColumn, "column") : null;

    const isGroup = options && options.group ? true : false;

    const getColumnAssoc = function (column) {
        if (onColumn) {
            const idx = onColumnField.indexOf(column);
            if (idx != -1) {
                const onColumnOpt = onColumn[idx];

                if (onColumnOpt.raw) {
                    return {
                        raw: onColumnOpt.raw,
                        column: onColumnOpt.column,
                    };
                } else {
                    return {
                        model: onColumnOpt.model,
                        field: onColumnOpt.field ? onColumnOpt.field : onColumnOpt.column,
                        alias: onColumnOpt.column,
                    };
                }
            }
        }

        return false;
    };

    // Search Value
    search = params.search && params.search.value ? params.search.value : null;
    // Data Column Attributes
    attributes = _.map(params.columns, function (value) {
        const data = value.data;

        const columnAssoc = getColumnAssoc(data);
        if (!columnAssoc) {
            return data;
        } else {
            if (columnAssoc.raw) {
                return [Sequelize.literal(columnAssoc.raw), columnAssoc.column];
            } else {
                return [
                    Sequelize.col(columnAssoc.model + "." + columnAssoc.field),
                    columnAssoc.alias,
                ];
            }
        }
    });

    // Merge all Params & Queries

    const arrWhere = [];
    query = {
        attributes: attributes,
    };
    if (params.perPage != "all") {
        const page = params.page || 1;
        const limit = params.perPage || 10;
        const start = (page - 1) * limit;
        query.offset = start;
        query.limit = limit;
    }
    if (search) {
        // Build search Query for all columns
        const querySearch = _.map(params.columns, function (value, key) {
            if (value.data == "id" || !value.searchable) {
                return;
            } else {
                const columnAssoc = getColumnAssoc(value.data);

                if (!columnAssoc) {
                    return {
                        [value.data]: {
                            [Op.like]: "%" + search + "%",
                        },
                    };
                } else {
                    if (columnAssoc.raw) {
                        return {
                            [Sequelize.literal('"' + columnAssoc.column + '"')]: {
                                [Op.like]: "%" + search + "%",
                            },
                        };
                    } else {
                        return {
                            ["$" + columnAssoc.model + "." + columnAssoc.field + "$"]: {
                                [Op.like]: "%" + search + "%",
                            },
                        };
                    }
                }
            }
        });
        arrWhere.push({ [Op.or]: querySearch });
    }

    // Build Query Order
    if (params.order && params.order.dir != null) {
        if (params.order.dir == "asc" || params.order.dir == "desc") {
            const columnAssoc = getColumnAssoc(params.order.column);
            if (!columnAssoc) {
                query.order = [[params.order.column, params.order.dir]];
            } else {
                if (columnAssoc.raw) {
                    query.order = [
                        [
                            Sequelize.literal('"' + columnAssoc.column + '"'),
                            params.order.dir,
                        ],
                    ];
                } else {
                    query.order = [
                        [
                            Sequelize.col(columnAssoc.model + "." + columnAssoc.field),
                            params.order.dir,
                        ],
                    ];
                }
            }
        }
    } else {
        query.order = [["createdAt", "DESC"]];
    }

    // Build Query Filter
    if (params.filter) {
        // column, value, operator
        const queryFilter = [];
        params.filter.forEach((fl) => {
            const columnAssoc = getColumnAssoc(fl.column);
            fl.operator = fl.operator || "eq";

            let fcol = fl.column;
            if (columnAssoc) {
                if (columnAssoc.raw) {
                    fcol = Sequelize.literal('"' + columnAssoc.column + '"');
                } else {
                    fcol = "$" + columnAssoc.model + "." + columnAssoc.field + "$";
                }
            }

            let fval = fl.value;
            if (fl.isDate) {
                if (fval == "now") {
                    fval = moment().toDate();
                } else if (fval == "today") {
                    const date = moment().set({
                        hour: 0,
                        minute: 0,
                        second: 0,
                    });
                    fval = date.toDate();
                } else {
                    fval = moment(fval).toDate();
                }
            }

            queryFilter.push({
                [fcol]: {
                    [Op[fl.operator]]: fval,
                },
            });
        });

        if (queryFilter.length > 0) {
            arrWhere.push({
                [Op.and]: queryFilter,
            });
        }
    }

    if (arrWhere.length > 0) {
        query.where = {
            [Op.and]: arrWhere,
        };
    }

    if (isGroup) {
        query.group = attributes;
    }

    return query;
};

async function getColumn(params, column) {
    return _.get(params, column);
}
