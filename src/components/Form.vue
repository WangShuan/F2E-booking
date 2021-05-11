<template>
  <div class="booking">
    <div :class="{ 'd-none': !isLoading }" class="loading">載入中.....</div>
    <div class="booking-box" v-if="!isDone && !isFail">
      <div class="formContent">
        <form class="booking-form" @submit.prevent.stop="submit">
          <label for="" class="booking-form-lable">姓名</label>
          <input
            type="text"
            name=""
            id=""
            class="booking-form-input"
            required
            v-model="booking.name"
          />
          <label for="" class="booking-form-lable">手機號碼</label>
          <input
            type="tel"
            name=""
            id=""
            class="booking-form-input"
            required
            minlength="10"
            v-model="booking.tel"
          />
          <label for="" class="booking-form-lable">入住日期</label>
          <DatePicker
            v-model="inDay"
            :min-date="new Date(new Date().getTime() + 24 * 60 * 60 * 1000)"
            :max-date="maxDay"
            :disabled-dates="disableDates"
            :masks="masks"
            :attributes="attribute"
            color="primary"
            is-required
          >
            <template v-slot="{ inputValue, inputEvents }">
              <input
                class="booking-form-input"
                :value="inputValue"
                v-on="inputEvents"
              />
            </template>
          </DatePicker>

          <label for="" class="booking-form-lable">退房日期</label>

          <DatePicker
            v-model="outDay"
            :min-date="new Date(new Date().getTime() + 24 * 60 * 60 * 1000)"
            :max-date="maxDay"
            :disabled-dates="disableDates"
            :attributes="attribute"
            :masks="masks"
            color="primary"
            is-required
          >
            <template v-slot="{ inputValue, inputEvents }">
              <input
                class="booking-form-input"
                :value="inputValue"
                v-on="inputEvents"
              />
            </template>
          </DatePicker>
          <div v-if="totalDays" class="booking-days">
            <template v-if="normalDays == 0">
              {{ totalDays }}天，{{ totalDays - 1 }}晚假日
            </template>
            <template v-else>
              {{ totalDays }}天，{{ normalDays }}晚平日
            </template>
          </div>
          <div v-else class="booking-days"><i>請選擇日期</i></div>
          <div class="booking-totalText">總計</div>
          <div class="booking-totalPrice">
            {{
              normalDays * currentRoom.normalDayPrice +
                (totalDays - normalDays - 1) * currentRoom.holidayPrice ||
              0 | currency
            }}
          </div>
          <button type="submit" class="booking-form-submit">確認送出</button>
          <span class="booking-footerText">
            此預約系統僅預約功能，並不會對您進行收費
          </span>
        </form>
      </div>
      <div class="infoContent">
        <a href="#" @click.prevent="closeForm()" class="infoContent-close"
          >&times;</a
        >
        <div class="booking-info">
          <div class="booking-info-title roomTitle">
            {{ currentRoom.name }}
            <div class="booking-info-title-hr"></div>
          </div>
          <div class="booking-info-detail">
            1人・ 單人床・附早餐・ 衛浴1間・18平方公尺 <br />
            平日（一～四）價格：{{ currentRoom.normalDayPrice }} /
            假日（五〜日）價格：{{ currentRoom.holidayPrice }}
          </div>
          <div class="booking-iconGroup">
            <div
              class="booking-icon"
              :class="{ 'booking-icon-disable': !item.state }"
              v-for="(item, index) in amenities"
              :key="index"
            >
              <img
                class="booking-icon-img"
                :src="require(`../assets/img/icons/${item.img}.svg`)"
                :alt="item.img"
              />
              <span class="booking-icon-text">{{ item.name }}</span>
            </div>
          </div>
          <div class="booking-info-title clear">
            訂房資訊
            <div class="booking-info-title-hr"></div>
          </div>
          <ul class="booking-info-notice">
            <li
              class="booking-info-notice-item"
              v-for="item in notice"
              :key="item"
            >
              {{ item }}。
            </li>
          </ul>
          <div class="booking-info-title clear">
            預約流程
            <div class="booking-info-title-hr"></div>
          </div>
          <div class="booking-info-stepContent">
            <div class="booking-info-step">
              <div class="booking-info-step-top">
                <img
                  :src="require(`../assets/img/icons/compose.svg`)"
                  alt=""
                  class="booking-info-step-img"
                />
              </div>
              <div class="booking-info-step-content">送出線上預約單</div>
            </div>
            <img
              :src="require(`../assets/img/icons/previous.svg`)"
              alt="arrow"
              class="booking-info-arrow"
            />
            <div class="booking-info-step">
              <div class="booking-info-step-top">
                <img
                  :src="require(`../assets/img/icons/search_chat.svg`)"
                  alt=""
                  class="booking-info-step-img"
                />
              </div>
              <div class="booking-info-step-content">
                系統立即回覆是否預訂成功 並以簡訊發送訂房通知
                (若未收到簡訊請來電確認)
              </div>
            </div>
            <img
              :src="require(`../assets/img/icons/previous.svg`)"
              alt="arrow"
              class="booking-info-arrow"
            />
            <div class="booking-info-step">
              <div class="booking-info-step-top">
                <img
                  :src="require(`../assets/img/icons/payment.svg`)"
                  alt=""
                  class="booking-info-step-img"
                />
              </div>
              <div class="booking-info-step-content">
                入住當日憑訂房通知 以現金或刷卡付款即可 (僅接受VISA.JCB.銀聯卡)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Outcome
      v-if="isDone || isFail"
      :isDone="isDone"
      :isFail="isFail"
      @reloadComponents="reloadComponents"
    ></Outcome>
  </div>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import Outcome from "@/components/Outcome";
import $ from "jquery";
export default {
  data() {
    return {
      today: "",
      inDay: "",
      outDay: "",
      booking: {
        name: "",
        tel: "",
        date: [],
      },
      isDone: false,
      isFail: false,
      isLoading: false,
      attribute: [{ key: "selectedDay", highlight: true, dates: "" }],
      masks: {
        input: "YYYY - MM - DD",
      },
      componentsKey: 0,
    };
  },
  components: { Outcome, DatePicker },
  props: ["currentRoom", "maxDay", "range", "disableDates"],
  watch: {
    inDay: function () {
      const vm = this;
      const inDay = new Date(vm.inDay);
      const outDay = new Date(vm.outDay);
      vm.attribute[0].dates = inDay;

      if (inDay > outDay) {
        vm.outDay = "";
      }
    },
    outDay: function () {
      const vm = this;
      const outDay = new Date(vm.outDay);
      vm.attribute[0].dates = outDay;
    },
  },
  computed: {
    amenities: function () {
      const vm = this;
      let obj = vm.currentRoom.amenities;
      let arr1 = Object.keys(obj);
      let arr2 = Object.values(obj);
      let arr = [];
      for (let i = 0; i < arr1.length; i++) {
        if (arr2[i]) {
          arr.push({ name: arr1[i], state: arr2[i] });
        }
      }
      arr.forEach((item) => {
        item.img = item.name;
        if (item.name == "Wi-Fi") {
          item.name = "Wifi";
        } else if (item.name == "Breakfast") {
          item.name = "早餐";
        } else if (item.name == "Room-Service") {
          item.name = "客房服務";
        } else if (item.name == "Television") {
          item.name = "電話";
        } else if (item.name == "Air-Conditioner") {
          item.name = "空調";
        } else if (item.name == "Refrigerator") {
          item.name = "冰箱";
        } else if (item.name == "Smoke-Free") {
          item.name = "全面禁菸";
        } else if (item.name == "Pet-Friendly") {
          item.name = "攜帶寵物";
        } else if (item.name == "Child-Friendly") {
          item.name = "適合兒童";
        }
      });
      return arr;
    },
    totalDays: function () {
      var day1 = new Date(Date.parse(this.inDay));
      var day2 = new Date(Date.parse(this.outDay));
      var difference = Math.abs(day2 - day1);

      return parseInt(difference / (1000 * 3600 * 24) + 1);
    },
    normalDays: function () {
      var day1 = new Date(Date.parse(this.inDay));
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

      return difference - weekends;
    },
    notice() {
      let arr = "・入住時間：最早15：00，最晚21：00；退房時間：10：00，請自行確認行程安排。 ・平日定義週一至週四；假日定義週五至週日及國定假日。 ・好室旅店全面禁止吸菸。 ・若您有任何問題，歡迎撥打 03-8321155 ( 服務時間 週一至週六 10:00 - 18:00 )。".split(
        "。"
      );
      arr.splice(arr.length - 1, 1);
      return arr;
    },
  },
  methods: {
    closeForm() {
      this.$emit("closeForm");
    },
    submit() {
      const vm = this;
      vm.isLoading = true;
      var startTime = new Date(vm.inDay);
      var endTime = new Date(vm.outDay);
      while (endTime - startTime >= 0) {
        let year = startTime.getFullYear();
        let month = startTime.getMonth();
        month = month < 9 ? "0" + (month + 1) : month + 1;
        let day =
          startTime.getDate().toString().length == 1
            ? "0" + startTime.getDate()
            : startTime.getDate();
        vm.booking.date.push(year + "-" + month + "-" + day);
        startTime.setDate(startTime.getDate() + 1);
      }

      var settings = {
        url:
          "https://challenge.thef2e.com/api/thef2e2019/stage6/room/" +
          this.$route.params.id,
        type: "POST",
        headers: {
          Authorization:
            "Bearer NbVLS4fUoSxsEteBh5WD47mhiDtxBkuLH1KfNkFLRSmJM2a59qNzhHsI4vrR",
        },
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(vm.booking),
        success: function () {
          vm.isDone = true;
          vm.isLoading = false;
          vm.booking.name = "";
          vm.booking.tel = "";
          vm.booking.date = [];
          vm.inDay = "";
          vm.outDay = "";
        },
        error: function () {
          vm.isFail = true;
          vm.isLoading = false;
          vm.booking.name = "";
          vm.booking.tel = "";
          vm.booking.date = [];
          vm.inDay = "";
          vm.outDay = "";
        },
      };

      $.ajax(settings);
    },
    reloadComponents() {
      this.isDone = false;
      this.isFail = false;
      this.$emit("reloadComponents");
    },
  },
  created() {
    const Today = new Date();
    let mm = Today.getMonth() + 1;
    if (mm < 10) {
      mm = `0${mm}`;
    }
    this.today = `${Today.getFullYear()}-${mm}-${Today.getDate()}`;
  },
};
</script>

<style></style>
