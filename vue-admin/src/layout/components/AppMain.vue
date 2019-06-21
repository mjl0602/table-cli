<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <template v-if="needCache.includes(name)">
        <keep-alive>
          <router-view :key="key" />
        </keep-alive>
      </template>
      <template v-else> -->
      <router-view :key="key" />
      <!-- </template> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    needCache() {
      return this.$store.state.tagsView.needCache
    },
    name() {
      return this.$route.name
    },
    key() {
      return this.$route.fullPath
    }
  },
  mounted() {
    // console.log(this.needCache)
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>

