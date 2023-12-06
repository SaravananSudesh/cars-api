const axios = require('axios')
const cheerio = require('cheerio')

const WEB_URL = 'https://www.autocarindia.com/cars'

const getAllBrandsName = async(req, res) => {
    try {
        
        const response = await axios.get(WEB_URL)
        const $ = cheerio.load(response.data)

        let brands = []
        
        const brands_section = $('#all-brand-section')
        
        brands_section.find('a').each(function(){
            title = $(this).attr('title').trim()
            page = $(this).attr('href').trim().slice(6)
            brands.push({ title, page })
        })
        

        res.json({
            brands : brands
        })


    } catch (error) {
        console.log(error)
    }    
}

module.exports = { getAllBrandsName }