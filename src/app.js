(function (Vue, _, members, awards) {
    'use strict';

    let canvasId = "tagCloudCanvas";
    let selectedColor = '#42382C';
    let defaultColor = '#F8EDD5FF';
    let chosen = repository.getByKey('chosen');
    let awardsRemains = awards;

    const getKey = function (item) {
        return `${item.name}-${item.id}`;
    };

    /**
     * @return {string} a string of html tags that contains all member
     * */
    const createHTML = function () {
        let html = ['<ul>'];
        _.forEach(members, function (item, index) {
            item.index = index;
            let color = chosen[getKey(item)] ? selectedColor : defaultColor;
            html.push(`'<li><a href="#" style="color: ${color};">${item.name}</a></li>'`);
        });
        html.push('</ul>');
        return html.join('');
    };
    const speed = function () {
        return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
    };

    /**
     * @return {Object} a list of name who win the lottery and the award name.
     * */
    const drawLuckyGuys = function () {
        if (_.size(awardsRemains) === 0) {
            return {};
        }
        let list = canvas.getElementsByTagName('a');

        let targetAward = _.first(awardsRemains);

        let luckyGuys = members.filter(
            function (item, index) {
                item.index = index;
                return !chosen[getKey(item)];
            })
            .map(function (item) {
                return Object.assign({score: Math.random()}, item);
            })
            .sort(function (itemA, itemB) {
                return itemA.score - itemB.score
            })
            .slice(0, targetAward.quota)
            .map(function (item) {
                chosen[getKey(item)] = 1;
                list[item.index].style.color = selectedColor;
                return item.name;
            });

        repository.setItem('chosen', chosen);

        awardsRemains = _.without(awardsRemains, targetAward);

        return {award: targetAward.title, guys: luckyGuys};
    };

    let canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    document.getElementById('main').appendChild(canvas);

    let canvasOptions = {
        animTiming: 'Smooth',
        bgColour: null,
        depth: 0.97,
        dragControl: 1,
        fadeIn: 800,
        initial: speed(),
        maxSpeed: 0.05,
        minBrightness: 0.2,
        outlineMethod: 'colour',
        outlineColour: selectedColor,
        outlineOffset: 0,
        reverse: true,
        shadowBlur: 2,
        shuffleTags: true,
        shadowOffset: [1, 1],
        stretchX: 1.7,
        textFont: 'Niconne, sans-serif',
        textColour: null,
        textHeight: 64,
        wheelZoom: false
    };

    const app = Vue.createApp({
        data() {
            return {
                running: false,
                luckyGuys: {},
                warningMsg: ``,
                showNotifyModal: false,
                showLuckGuysModal: false
            }
        },
        mounted() {
            canvas.innerHTML = createHTML();
            TagCanvas.Start(canvasId, '', canvasOptions);
        },
        methods: {
            outputJSONFile: function () {
                repository.getDB();
            },
            reset: function () {
                this.showNotifyModal = true;
            },
            clearStorage: function () {
                /**
                 * Clear storage data and init all variable
                 * */
                repository.clearAll();
                awardsRemains = awards;
                chosen = {};
                this.showNotifyModal = false;
                this.showLuckGuysModal = false;
                this.running = false;
                this.warningMsg = '';
                canvas.innerHTML = createHTML();
                TagCanvas.Reload(canvasId);
            },
            drawing: function () {
                if (this.running) {
                    TagCanvas.SetSpeed(canvasId, speed());
                    this.showLuckGuysModal = true;
                    this.luckyGuys = drawLuckyGuys();
                    if (_.isEmpty(this.luckyGuys)) {
                        this.warningMsg = `所有獎項皆已抽完!`;
                    } else {
                        TagCanvas.Reload(canvasId);
                    }
                } else {
                    this.showLuckGuysModal = false;
                    TagCanvas.SetSpeed(canvasId, [5, 1]);
                }

                this.running = !this.running;
            }
        }
    });
    app.component('modal-notification', {
        template: `<div class="modal is-active">
                                <div class="modal-background"></div>
                                <div class="modal-card">
                                    <header class="modal-card-head">
                                        <p class="modal-card-title">要確定耶</p>
                                    </header>
                                    <section class="modal-card-body">
                                        執行後的結果將不可逆，會將儲存在記憶體中的結果清空。
                                    </section>
                                    <footer class="modal-card-foot">
                                        <button @click="clearAll" class="button is-success">確定</button>
                                        <button @click="$emit('close')" class="button">取消</button>
                                    </footer>
                                </div>
                           </div>`,
        methods: {
            clearAll() {
                this.$emit('clear');
            }
        }
    });
    app.mount('#controlPanel');
})(Vue, _, members, awards);
