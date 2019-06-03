<template>
  <div id="app">
		<div class="all-page">
			<router-view/>
		</div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
}
.all-page{
  color: #333;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;
	min-height: 100%;
	background-color: #f4f4f4;
}
</style>
