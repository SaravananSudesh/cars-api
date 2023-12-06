const axios = require('axios')
const cheerio = require('cheerio')

const WEB_URL = 'https://www.autocarindia.com/cars'

const getCarsByBrand = async(req, res) => {
    try {
        let brand = req.params['brand']
        const response = await axios.get(`${WEB_URL}/${brand}`)
        const $ = cheerio.load(response.data)

        let cars = []
        
        const cars_section = $('.ac-col-sec.ac-nd-col-1.mob-pad-col.bg-gray .row.mob-pad-col')

        cars_section.find('.car-lis-sec1').each(
            function(){
                let name = $(this).find('.car-lis-name').find('.heading-h4').find('a').text().trim()
                let page = $(this).find('.car-lis-name').find('.heading-h4').find('a').attr('href').trim().slice(6)
                let brand_page = page.split('/')[0]
                let img = $(this).find('.car-lis-img').find('a').find('img').attr('src').trim().split('?n=').pop().split('&w=')[0]
                let on_road =$(this).find('.car-lis-name').find('.ac-price-sec').find('.ac-price1.ac-mr-right').find('h4').text().trim()

                let colours = []
                $(this).find('.car-lis-img').find('.car-color').find('.color-item').each(
                    function(){
                        let name = $(this).attr('title')
                        let code = $(this).attr('style').slice(11)
                        if(name && code) colours.push({ name, code })
                })

                let spec_map = []

                $(this).parent().find('.car-lis-sec2').find('.car-dis-sec').each(
                    function(){
                        spec_map.push($(this).find('p').text())
                    })

                let specs = {
                    engine: spec_map[0].slice(6),
                    fuel: spec_map[1].slice(9),
                    transmission: spec_map[2].slice(12),
                    mileage: spec_map[3].slice(7)
                }

                cars.push({
                    name: name,
                    brand_page: brand_page,
                    page: page,
                    img: img,
                    colours: colours,
                    on_road: on_road,
                    specs: specs
                })
            })

        res.json({
            cars : cars
        })

    } catch (error) {
        console.log(error)
    }
}

const getCarDetails = async(req, res) => {
    try {
        
        let brand = req.params['brand']
        let name = req.params['name']
        const response = await axios.get(`${WEB_URL}/${brand}/${name}`)
        const $ = cheerio.load(response.data)

        const variants_section = $('.more-about-car-se .tab_content_container1 #Varient-more .car-co-tab .tabs .tabPanel')

        let variants = []

        variants_section.find('.mod-var-detail').each(
            function(){
                let variant_url = $(this).find('.var-det-sec1').find('a').attr('href').trim().slice(6)
                let variant = $(this).find('.var-det-sec1').find('a').find('h6').text().trim()
                let variant_price = $(this).find('.var-det-sec2').find('p').text().trim().split(' *')[0]
                let variant_specs = []
                variants.push({ variant, variant_url, variant_price, variant_specs })
            })

            for(let i=0; i<variants.length; i++){
                let variant_specs = await getSpecifications(variants[i].variant_url)
                variants[i].variant_specs = variant_specs
            }

            const images_section = $('.more-about-car-se .tab_content_container1 #Images-more .news-deail-img div')

            let images = []
    
            images_section.find('.item').each(
                function(){
                    let image_url = $(this).find('img').attr('src').split('?n=').pop().split('&w=')[0]
                    if(image_url){
                        images.push(image_url)
                    }
                })

            name = $('.heading-h4').text()

        res.json({
            name: name,
            variants : variants,
            images: images
        })

    } catch (error) {
        console.log(error)
    }
}

async function getSpecifications(url){
    const response = await axios.get(`${WEB_URL}/${url}`)
    const $ = cheerio.load(response.data)
    
    let specs = []

    const specsWrapper = $('#specificationssection')
    specsWrapper.find('.com-car-tab').each(function(){
        let spec = {
            key: $(this).find('.com-car-sec-1').find('p').text(),
            value: $(this).find('.com-car-sec-2').find('p').text(),
        }
        console.log(specs.length)
        specs.push(spec)
    })

    return specs
}

module.exports = { getCarsByBrand, getCarDetails }