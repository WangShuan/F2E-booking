<template>
  <div>
    <div :class="{ show: isDone }" class="booking-ret">
      <div class="booking-ret-content">
        <a href="#" @click.prevent="closeRet()" class="booking-ret-close"
          >&times;</a
        >
        <img class="booking-ret-img" src="./img/icons/list_null.svg" />
        <img
          src="./img/icons/success.svg"
          alt=""
          class="booking-ret-positionImg"
        />
        <div class="booking-ret-title">預約成功</div>
        <div class="booking-ret-detail">
          請留意簡訊發送訂房通知，入住當日務必出示此訂房通知，
          若未收到簡訊請來電確認，謝謝您
        </div>
      </div>
    </div>
    <div :class="{ show: isFail }" class="booking-ret">
      <div class="booking-ret-content">
        <a href="#" @click.prevent="closeRet()" class="booking-ret-close"
          >&times;</a
        >
        <img class="booking-ret-img" src="./img/icons/list_null.svg" />
        <img
          src="./img/icons/fail.svg"
          alt=""
          class="booking-ret-positionImg"
        />
        <div class="booking-ret-title">預約失敗</div>
        <div class="booking-ret-detail">
          哎呀！晚了一步！您預約的日期已經被預約走了， 再看看其它房型吧
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["isDone", "isFail"],
  methods: {
    closeRet() {
      this.$emit("closeRet");
    },
  },
};
</script>

<style></style>
