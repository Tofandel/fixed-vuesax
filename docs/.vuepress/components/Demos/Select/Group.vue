<template lang="html">
  <div class="con-select-example">
    <vs-select
        class="selectExample"
        label="Default"
        v-model="select1"
        >
          <vs-select-group :key="index" v-for="(item,index) in options1" :title="item.title" v-if="item.group">
            <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in item.group"/>
          </vs-select-group>
    </vs-select>
    <vs-select
        multiple
        class="selectExample"
        label="Multiple"
        v-model="select2"
        >
        <vs-select-group :key="index" v-for="(item,index) in options2" :title="item.title" v-if="item.group">
          <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in item.group"/>
        </vs-select-group>
    </vs-select>
    <vs-select
        autocomplete
        class="selectExample"
        label="Autocomplete"
        v-model="select3"
        >
        <vs-select-group :key="index" v-for="(item,index) in options3" :title="item.title" v-if="item.group">
          <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in item.group"/>
        </vs-select-group>
    </vs-select>
  </div>
</template>

<script>
export default {
  data(){
    return {
      select1:6,
      select2:[6],
      select3:['red'],
      options1:[
        {
          title:'Figures',
          group:[
            {text: 'Romboid', value: 4},
            {text: 'Trapeze', value: 5},
            {text: 'Triangle', value: 6},
            {text: 'Polygon', value: 7},
          ]
        },
        {
          title:'Colors',
          group:[
            {text: 'Red', value: 'red'},
            {text: 'Green', value: 'green'},
            {text: 'Blue', value: 'blue'},
            {text: 'Purple', value: 'purple'},
          ]
        }
      ],
      options2:[
        {
          title:'Figures',
          group:[
            {text: 'Romboid', value: 4},
            {text: 'Trapeze', value: 5},
            {text: 'Triangle', value: 6},
            {text: 'Polygon', value: 7},
          ]
        },
        {
          title:'Colors',
          group:[
            {text: 'Red', value: 'red'},
            {text: 'Green', value: 'green'},
            {text: 'Blue', value: 'blue'},
            {text: 'Purple', value: 'purple'},
          ]
        }
      ],
      options3:[
        {
          title:'Figures',
          group:[
            {text: 'Romboid', value: 4},
            {text: 'Trapeze', value: 5},
            {text: 'Triangle', value: 6},
            {text: 'Polygon', value: 7},
          ]
        },
        {
          title:'Colors',
          group:[
            {text: 'Red', value: 'red'},
            {text: 'Green', value: 'green'},
            {text: 'Blue', value: 'blue'},
            {text: 'Purple', value: 'purple'},
          ]
        }
      ],
    }
  },
  methods:{
    prueba(){
      console.log("prueba de focsu");
    }
  }
}
</script>

<style lang="css">
.selectExample {
  margin: 10px;
}
.con-select-example {
  display: flex;
  align-items: center;
  justify-content: center;
}
.con-select .vs-select {
  width: 100%
}
@media (max-width: 550px) {
  .con-select {
    flex-direction: column;
  }
  .con-select .vs-select {
    width: 100%
  }
}
</style>
