<template>
    <div class="panel-heading">
        <div class="panel-lead">
            <div class="title"><slot name="title"></slot></div>
            <p class="description"><slot name="description"></slot></p>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.panel-heading {
    padding: 15px;
    background: #e8edf0;
    border-color: #e8edf0;
    position: relative;
    .panel-lead {
        font-size: 14px;
        .title {
        font-weight: bold;
        font-style: normal;
        }
        .description {
        margin-top: 5px;
        }
    }
}
</style>