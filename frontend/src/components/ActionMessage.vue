<template>
  <dice-roll
    v-if="message.parsedBy == 'roll'"
    :message = message
  ></dice-roll>
  <div v-else class="message action action-default q-py-sm q-mt-xs bg-secondary text-white">
      {{message.sender}} {{message.action}}
    <span class="message-time">
      <timeago :datetime="message.timestamp" :auto-update="60"></timeago>
    </span>
  </div>
</template>

<script>
import DiceRoll from 'components/DiceRoll';

export default {
  props: ['message'],
  components: {
    DiceRoll
  }
};
</script>

<style>

.dice-result {
  font-size:2em;
}

.message.action {
  text-align: center;
  font-size: 0.9em;
}

.action-default .message-time {
  font-size: 0.8em;
  opacity: 0.6;
  font-weight: 300;
  display: inline-block;
}

</style>
