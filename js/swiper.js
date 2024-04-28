Vue.component('v-swiper', {
    template: '#swiper',
    props: {
        perview: {
            type: Number,
            default: 1
        },
        space: {
            type: Number,
            default: 15
        }
    },
    mounted() {
        new Swiper(this.$el, {
            slidesPerView: +this.perview,
            spaceBetween: +this.space,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                type: 'fraction',
            },
            // navigation: {
            //     nextEl: '.swiper-button-next',
            //     prevEl: '.swiper-button-prev',
            // },
        })
    }
})

new Vue({
    el: '#app'
})