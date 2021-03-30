<template>
  <div class="home" :style="`background-image: url(./img/house/bg${i}.jpeg)`">
    <div class="bg-opacity">
      <div class="logo">
        <img
          src="https://househotel.netlify.app/static/media/logo.3fafe707.svg"
          alt="好室"
          class="logo-img"
        />
        <div class="logo-title">好室旅店。HOUSE HOTEL</div>
        <ul class="logo-text">
          <li>花蓮縣花蓮市國聯一路1號</li>
          <li>03-8321155</li>
          <li>HOUSE@HOTEL.COM</li>
        </ul>
        <div class="logo-page">
          <span
            v-for="index in 4"
            :key="index"
            :class="{ 'page-active': index == i }"
            @click="i = index"
          ></span>
        </div>
      </div>
      <div class="position-relative">
        <ul class="btnGroup">
          <li
            v-for="(item, index) in data"
            :key="item.id"
            class="imgBtn"
            :style="`background-image: url(./img/room${index + 1}/1.jpeg)`"
          >
            <div
              class="imgBtn-active"
              @click="$router.push(`/booking/${item.id}`)"
            >
              {{ item.name }}
            </div>
          </li>
        </ul>
        <div class="btnGroup-footer">UI DESIGN by Pei-Chuan Li</div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      i: 1,
      data: "",
    };
  },
  methods: {
    autoPlay() {
      const vm = this;
      setInterval(function () {
        if (vm.i == 4) {
          vm.i = 1;
        } else {
          vm.i += 1;
        }
      }, 5000);
    },
  },
  created() {
    this.autoPlay();
    const vm = this;
    var form = new FormData();
    var settings = {
      url: "https://challenge.thef2e.com/api/thef2e2019/stage6/rooms",
      method: "GET",
      timeout: 0,
      headers: {
        Authorization:
          "Bearer NbVLS4fUoSxsEteBh5WD47mhiDtxBkuLH1KfNkFLRSmJM2a59qNzhHsI4vrR",
      },
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (res) {
      vm.data = JSON.parse(res).items;
    });
  },
};
</script>
