<template lang="pug">
  transition(name="modal")
    .dialog-mask(@click="cancel")
      .dialog-wrapper
        .dialog(@click.stop)
          p {{text}}
          .buttonWrap
            button.cancel(@click="cancel") Cancel
            button.ok(@click="ok()") OK
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  methods: {
    ok () {
      this.$emit('test');
      this.close()
    },

    cancel () {
      this.close()
    },

    close () {
      const parent = this.$el.parentNode
      parent.removeChild(this.$el)
      this.$destroy()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.dialog-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.dialog {
  font-family: $gothic;
  margin: 0 auto;
  padding: 20px;
  width: 350px;
  background: #fff;
  border-radius: 5px;

  p{
    @include font-size(16);
    margin-bottom: 20px;
    text-align: center;
  }
}

.buttonWrap {
  display: table;
  margin: 0 auto;

  button {
    display: inline-block;
    padding: 5px 20px;
    font-size: 14px;
    outline: none;
  }
  .cancel {
    border: none;
    background: none;
    margin-right: 15px;
  }

  .ok {
    border: none;
    border-radius: 5px;
    background: #353535;
    color: #fff;
  }
}
</style>
