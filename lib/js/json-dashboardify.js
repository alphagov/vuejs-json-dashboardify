let JsonDashboardifyDataElement = Vue.component('json-dashboardify-data-element', {

    props: ['source'],

    data: function() {
        console.log("CALLED DATA METHOD");
        console.log("Source", this.source);
        let data = {
            id: 1,
            component: "container",
            content: "",
            cssClass: "",
            children: []
        };
        //data = this.source;
        for(key in data) {
            if (this.source[key]) data[key] = this.source[key];
        }
        if (data.component == "table") {
            data.tableId = 'chart-table-'+data.id;
            data.wrapperId = 'chart-wrapper-'+data.id;
        }
        console.log(data.id, data.content);
        return data;
    },

    template: function() {
        let elementTemplates = {
            layout: `<div v-if="component == 'grid' || component == 'container'" v-bind:class="cssClass">
                <json-dashboardify-data-element v-if="children" v-for="item in children" :key="item.id" v-bind:source="item">
                </json-dashboardify-data-element>
            </div>`,
            h1: `<h1 v-if="component == 'h1'" v-bind:class="cssClass">{{content}}</h1>`,
            h2: `<h2 v-if="component == 'h2'" v-bind:class="cssClass">{{content}}</h2>`,
            h3: `<h3 v-if="component == 'h3'" v-bind:class="cssClass">{{content}}</h3>`,
            p: `<p v-if="component == 'p'" v-bind:class="cssClass">{{content}}</p>`,
            table: `<div v-if="component == 'table'"
                         v-bind:class="{ 'chart-wrapper': content.chartOptions }"
                         v-bind:type="content.chartOptions ? content.chartOptions.type: 'bar'"
                         v-bind:series="content.chartOptions ? content.chartOptions.series: 'rows'"
                         v-bind:x-axis="content.chartOptions ? content.chartOptions.xAxis: 'x'"
                         v-bind:y-axis="content.chartOptions ? content.chartOptions.yAxis: 'y'"
                         v-bind:above="content.chartOptions ? content.chartOptions.above: 'true'"
                         v-bind:separate="content.chartOptions ? content.chartOptions.separate: 'false'"
                         v-bind:smoothed="content.chartOptions ? content.chartOptions.smoothed: 'false'"
                         v-bind:stacked="content.chartOptions ? content.chartOptions.stacked: 'false'"
                         v-bind:id="wrapperId"
                         >
                    <table v-bind:class="cssClass" v-bind:id="tableId">
                        <caption class="govuk-table__caption">{{ content.caption }}</caption>
                        <thead class="govuk-table__head">
                            <tr v-for="headingRow in content.head.columns" class="govuk-table__row">
                                <th v-for="(heading,columnIndex) in headingRow"
                                    v-if="content.headingColumns.includes(columnIndex)"
                                    class="govuk-table__header">
                                    {{ heading }}
                                </th>
                                <th v-for="(heading,columnIndex) in headingRow"
                                    v-if="!content.headingColumns.includes(columnIndex)"
                                    class="govuk-table__header govuk-table__header--numeric">
                                    {{ heading }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="govuk-table__body">
                            <tr v-for="bodyRow in content.body.rows" class="govuk-table__row">
                                <th v-for="(cell,columnIndex) in bodyRow" v-if="content.headingColumns.includes(columnIndex)" class="govuk-table__header">{{ cell }}</th>
                                <td v-for="(cell,columnIndex) in bodyRow" v-if="!content.headingColumns.includes(columnIndex)" class="govuk-table__cell govuk-table__cell--numeric">{{ cell }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
        };

        let templateData = "<div>";
        for(element in elementTemplates) {
            let elementTemplate = elementTemplates[element];
            templateData += `<!-- start ${element} -->
                ${elementTemplate}
                <!-- end $element -->`;
        }
        templateData += "</div>";
        templateData = templateData.replace(/\>\s+\</g,'>\n<');
        console.log(templateData);
        return templateData;
    }(),

    methods: {

    },

    beforeCreate: function() {
        //console.log("bc", this.source);
    },

    created: function() {
        console.log("ac", this.source);
    },

    mounted: function() {
        console.log("am", this.source);
        let id, element, attr, val = null;
        if (this.component == "table" && this.content.chartOptions) {
            console.log(this.wrapperId);
            //new TableChart().$mount('#'+this.wrapperId);
            this.$root.mountTableCharts()
        }
    },

    beforeMount: function() {
        console.log("bm", this.source);
    }
});

let JsonDashboardifyUrlElement = Vue.component('json-dashboardify-url-element', {

    props: ['source'],

    retrieved: false,

    data: function () {
        console.log("CALLED DATA METHOD");
        let data = {
            id: 1,
            loaded: false,
            component: "container",
            cssClass: "",
            content: "",
            children: []
        };
        return data;
    },

    methods: {
        setRetrieved: function(data) {
            console.log("retrieved", data);
            // Set data property by property since replacing the object wholesale breaks the watchers
            this.idifyData("1", data);
            for(key in data) {
                this.$set(this, key, data[key]);
            }
        },
        idifyData: function(prefix, data) {
            let i = 0, child = null, id = null;
            data.id = prefix;
            if (data.children) {
                for (i=0;i<data.children.length;i++) {
                    child = data.children[i];
                    id = prefix + '-' + (i+1);
                    this.idifyData(id, child);
                }
            }
        }

    },

    template: `<div class="json-dashboardified" v-if="loaded" v-bind:class="cssClass">
                <json-dashboardify-data-element  v-if="children" v-for="item in children" :key="item.id" v-bind:source="item"></json-dashboardify-data-element>
                <pre>{{ $data | json 4 }}</pre>
            </div>`,

    beforeCreate: function() {
        console.log("BEFORE CREATE");
    },
    created: async function() {
        console.log("CREATED");
        if (this.source) {
            console.log("Loading data from url");
            await new Promise((resolve, reject) => {
                this.$http.get(this.source).then(response => {

                    try {
                        data = JSON.parse(response.bodyText);
                        data.loaded = true;
                        console.log("data", data);
                        //self.retrieved = data;
                        this.setRetrieved(data);
                        resolve(this.data);
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                }, response => {
                    // error callback
                    console.log("errored");
                    reject(response);
                });
            });
        }
    },
    beforeMount: function() {
        console.log("BEFORE MOUNT");
    },
    mounted: function() {
        console.log('MOUNTED');
    }
});