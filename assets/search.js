import axios from "axios";

let displayed = false




$(document).ready(() => {
    if (window.location.pathname === "/") {
        // document.addEventListener('click',()=>{
        //     $(".search-results").css('display', 'none')
        //     $('#autores').html('')
        // })


        let cityInput = $('#form_city')


        let matches = []
        const displaying = () => {
            axios.get('http://api.weatherapi.com/v1/search.json?key=109eb4c71a9e4298a01160154220602&q=' + cityInput.val()).then(async(res) => {
                matches = await []
                res.data.map((city) => {
                    if (matches.indexOf(city.name) === -1 && matches.length <= 6) {
                        matches.push(city.name)
                    }
                })
                
                // for(let i = 1; i < matches.length; i++){
                //     console.log(i);
                // }
                
                matches.map((city) => {
                        $('#autores').append(`<a href="#" class="suggestsLinks">${city}</a><br/>`)
                })
                $(".search-results").css('display', 'block')
                displayed = !displayed
            })
        }


        $(cityInput).on('keyup', () => {
            if (cityInput.val().length >= 4) {
                if (!displayed) {
                    $('#autores').html('')
                    displaying()
                    setTimeout(() => {
                        let suggestsLinks = document.querySelectorAll('.suggestsLinks')
                        suggestsLinks.forEach((el) => {
                            el.addEventListener('click', (e) => {
                                e.preventDefault()
                                $(cityInput).val(el.textContent)
                                $(".search-results").css('display', 'none')
                                $('#autores').html('')
                                displayed = false
                                matches = []
                            })
                        })
                    }, 500)
                    matches = []
                }
            }
            else {
                $(".search-results").css('display', 'none')
                $('#autores').html('')
                displayed = false
                matches = []
            }
        })
    }
})

