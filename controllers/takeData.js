const { User } = require('../models')
const Joi = require('joi');
const db = require('../models');
const { getAll } = require('../helpers/getData');
const ErrorResponse = require('../utils/ErrorResponse');

module.exports = async (req, res, next) => {
    try {
        let search = []
            let { cities, startDate, endDate } = req.query
            if (!cities) {
                cities = []
            } else {
                cities = cities.split(',')
                cities.forEach(city => {
                    search.push(city)
                });
            }

            if (startDate && endDate) {
                let epochStart = new Date(startDate).getTime()
                let epochEnd = new Date(endDate).getTime()

                if (epochEnd - epochStart < 0) {
                    return next(new ErrorResponse('Date invalid. Please check again. End date must bigger than Star date ', 401));
                }
            }

            if (startDate && !isNaN(new Date(startDate).getTime())) {
                search.push(startDate)
            }

            if (endDate && !isNaN(new Date(endDate).getTime())) {
                search.push(endDate)
            }
            
            let query = getAll(cities, startDate, endDate)
            const result = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: search
            })


            let labelCharts = []
            let dataCharts =[]
            let charts = result.map(el => {
                labelCharts.push(`${el.area_name}`)
                dataCharts.push(+((el.rt_comp + el.sk_comp) / el.n_comp * 100).toFixed(1))
            })
            let datataTable = []
             result.map(el => {
                datataTable.push({
                    brand: "ROTI TAWAR",
                    persent: +((el.rt_comp) / (el.rt_comp + el.rt_ncomp) * 100).toFixed(1),
                    area: el.area_name
                })
                datataTable.push({
                    brand: "SUSU KALENG",
                    persent:+((el.sk_comp) / (el.sk_comp + el.sk_ncomp) * 100).toFixed(1),
                    area: el.area_name
                })
            })
            let storeAreas = await db.StoreArea.findAll();
            res.render("index", {
                    charts: {
                        labelCharts,
                        dataCharts
                    },
                    datataTable,
                    storeAreas
            });
        next();
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}