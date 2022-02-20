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
        const displaying = async () => {
            axios.get('http://api.weatherapi.com/v1/search.json?key=109eb4c71a9e4298a01160154220602&q=' + cityInput.val()).then((res) => {
                res.data.map((city) => {
                    if (matches.indexOf(city.name) === -1 && matches.length <= 6) {
                       matches.push(city.name)
                    }
                })
                
                matches.map((city) => {
                       return $('#autores').append(`<a href="#" class="suggestsLinks">${city}</a><br/>`)
                })
                $(".search-results").css('display', 'block')
                displayed = !displayed
            })
        }


        $(cityInput).on('keyup', () => {
            if (cityInput.val().length >= 4) {
                $('#autores').html('')
                displaying()
                if (!displayed) {
                    $('#autores').html('')
                    matches = []
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

