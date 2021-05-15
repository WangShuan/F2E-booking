<template>
  <div class="container" v-if="currentRoom">
    <div
      class="imgGroup"
      :style="`background-image: url(${currentRoom.imageUrl[i]})`"
    >
      <div class="bg-linearGradient">
        <div
          class="imgGroup-content"
          @click="showAlbum(currentRoom.imageUrl[i])"
        >
          <router-link to="/" class="preBtn">
            <img
              :src="require(`../assets/img/icons/previous.svg`)"
              class="preBtn-img"
              alt=""
            />
            查看其它房型
          </router-link>

          <div class="imgGroup-text">
            <div class="price">{{ totalPrice || todayPrice | currency }}</div>
            /
            <div class="day">{{ totalDays - 1 || 1 }}晚</div>
            <button class="imgGroup-btn" @click.stop="isShow = true">
              Booking now
            </button>
          </div>
          <div class="page">
            <span
              v-for="index in 3"
              :key="index"
              :class="{ active: index == i + 1 }"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div class="roomContent">
      <div class="room-title">
        <h1>{{ currentRoom.name }}</h1>

        <small
          >{{ guest }}人・ {{ bed.qty }}張 {{ bed.kind }} Size 床・
          附早餐・衛浴{{ currentRoom.descriptionShort["Private-Bath"] }}間・{{
            currentRoom.descriptionShort.Footage
          }}平方公尺</small
        >
      </div>
      <div class="room-detail">
        平日（一～四）價格：{{ currentRoom.normalDayPrice }} /
        假日（五〜日）價格：{{ currentRoom.holidayPrice }} <br />
        入住時間：{{ currentRoom.checkInAndOut.checkInEarly }}（最早）/
        {{ currentRoom.checkInAndOut.checkInLate }}（最晚） <br />
        退房時間：{{ currentRoom.checkInAndOut.checkOut }}
      </div>
      <ul class="room-list">
        <li v-for="(item, index) in description" :key="index">・{{ item }}.</li>
      </ul>
      <div class="room-iconGroup">
        <div
          class="room-icon"
          :class="{ 'room-icon-disable': !item.state }"
          v-for="(item, index) in amenities"
          :key="index"
        >
          <img
            v-if="item.state"
            :src="require(`../assets/img/icons/ok.svg`)"
            alt=""
            class="positionIcon"
          />
          <img
            v-else
            :src="require(`../assets/img/icons/cancel.svg`)"
            alt=""
            class="positionIcon"
          />
          <img
            class="room-icon-img"
            :src="`./img/icons/${item.name}.svg`"
            :alt="item.name"
          />
          <span class="room-icon-text">{{ item.name }}</span>
        </div>
      </div>
      <div class="dateCheck">
        <div class="dateCheck-title">空房狀態查詢</div>
        <div class="dateCheck-calendar">
          <DatePicker
            :value="null"
            :columns="$screens({ default: 1, lg: 2 })"
            :min-date="new Date(new Date().getTime() + 24 * 60 * 60 * 1000)"
            :max-date="maxDay"
            :disabled-dates="disableDates"
            color="primary"
            v-model="range"
            is-expanded
            is-range
          ></DatePicker>
        </div>
        <div class="dateCheck-reset" @click="resetRange()">重新選取</div>
      </div>
    </div>

    <div v-if="imgUrl" class="album" @click="imgUrl = ''">
      <img
        :src="require(`../assets/img/icons/album-prev.svg`)"
        class="album-btn"
        @click.stop="lessImgUrl()"
        alt=""
      />
      <div
        :style="{ 'background-image': `url(${imgUrl})` }"
        alt=""
        class="album-img"
      ></div>
      <img
        :src="require(`../assets/img/icons/album-next.svg`)"
        class="album-btn"
        @click.stop="addImgUrl()"
        alt=""
      />
    </div>
    <Form
      :key="componentsKey"
      :currentRoom="currentRoom"
      :maxDay="maxDay"
      :range="range"
      :disableDates="disableDates"
      @closeForm="closeForm"
      @reloadComponents="reloadComponents"
      v-if="isShow"
    ></Form>
  </div>
</template>

<script>
import Form from "@/components/Form";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import $ from "jquery";
export default {
  data() {
    return {
      currentRoom: "",
      i: 0,
      currentAlbum: "",
      imgUrl: "",
      isShow: false,
      range: { start: "", end: "" },
      disableDates: [],
      componentsKey: 0,
    };
  },
  components: { Form, DatePicker },
  computed: {
    description: function () {
      const vm = this;
      let arr = vm.currentRoom.description.split(".");
      arr.splice(arr.length - 1, 1);
      return arr;
    },
    guest: function () {
      const vm = this;
      let min = vm.currentRoom.descriptionShort.GuestMin;
      let max = vm.currentRoom.descriptionShort.GuestMax;
      if (min == max) {
        return max;
      } else {
        return `${min} ~ ${max}`;
      }
    },
    bed: function () {
      const vm = this;
      const qty = vm.currentRoom.descriptionShort.Bed.length;
      const kind = vm.currentRoom.descriptionShort.Bed[0];
      return { qty: qty, kind: kind };
    },
    amenities: function () {
      const vm = this;
      let obj = vm.currentRoom.amenities;
      let arr1 = Object.keys(obj);
      let arr2 = Object.values(obj);
      let arr = [];
      for (let i = 0; i < arr1.length; i++) {
        arr.push({ name: arr1[i], state: arr2[i] });
      }
      return arr;
    },
    maxDay: function () {
      var dd = new Date();
      dd.setDate(dd.getDate() + 90);
      var y = dd.getFullYear();
      var m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      return y + "-" + m + "-" + d;
    },
    totalDays: function () {
      var day1 = new Date(this.range.start);
      var day2 = new Date(this.range.end);

      var difference = Math.abs(day2 - day1);

      return difference / (1000 * 3600 * 24) + 1;
    },
    totalPrice: function () {
      var day1 = new Date(this.range.start);
      var difference = this.totalDays - 1;
      var remainDay = difference % 7;
      var weeks = Math.floor(difference / 7);
      var weekends = 2 * weeks;
      var weekDay = day1.getDay();
      for (var i = 0; i < remainDay; i++) {
        if (
          weekDay + i == 5 ||
          weekDay + i == 6 ||
          weekDay + i == 0 ||
          weekDay + i == 7
        ) {
          weekends = weekends + 1;
        }
      }

      const normalD = difference - weekends;
      return (
        normalD * this.currentRoom.normalDayPrice +
        (this.totalDays - normalD - 1) * this.currentRoom.holidayPrice
      );
    },
    todayPrice: function () {
      const week = new Date().getDay();
      if (week == 0 || week >= 5) {
        return this.currentRoom.holidayPrice;
      } else {
        return this.currentRoom.normalDayPrice;
      }
    },
  },
  methods: {
    resetRange() {
      this.range = { start: "", end: "" };
    },
    autoPlay() {
      const vm = this;
      setInterval(function () {
        if (vm.i == 2) {
          vm.i = 0;
        } else {
          vm.i += 1;
        }
      }, 5000);
    },
    showAlbum(imgUrl) {
      this.imgUrl = imgUrl;
    },
    addImgUrl() {
      let i = this.currentRoom.imageUrl.findIndex((item) => {
        return item === this.imgUrl;
      });
      if (i == 2) {
        i = 0;
      } else {
        i = i + 1;
      }
      this.imgUrl = this.currentRoom.imageUrl[i];
    },
    lessImgUrl() {
      let i = this.currentRoom.imageUrl.findIndex((item) => {
        return item === this.imgUrl;
      });
      if (i == 0) {
        i = 2;
      } else {
        i = i - 1;
      }
      this.imgUrl = this.currentRoom.imageUrl[i];
    },
    closeForm() {
      this.isShow = false;
      this.getData();
    },
    getData() {
      const vm = this;
      var form = new FormData();
      var settings = {
        url:
          "https://challenge.thef2e.com/api/thef2e2019/stage6/room/" +
          this.$route.params.id,
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
        vm.currentRoom = JSON.parse(res).room[0];
        const bookingArr = JSON.parse(res).booking;
        bookingArr.forEach((item) => {
          vm.disableDates.push(item.date);
        });
      });
    },
    reloadComponents() {
      this.getData();
      this.componentsKey += 1;
    },
  },
  created() {
    const vm = this;
    vm.autoPlay();
    vm.getData();
  },
};
</script>

<style lang="scss">
.vc {
  &-container {
    border: none;
    --primary-100: #bcc1ad;
    --primary-200: #a6ad92;
    --primary-300: #909877;
    --primary-400: #7a845c;
    --primary-500: #646f41;
    --primary-600: #38470b;
    --primary-700: #334411;
    --primary-800: #313f09;
    --primary-900: #252f07;
  }
  &-arrow {
    height: 70px;
  }
  &-header {
    height: 80px;
  }
  &-weeks {
    padding: 5px 10px;
  }
}
</style>
