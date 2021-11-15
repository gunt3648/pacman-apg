<template>
  <div class="mb-4 video-wrapper">
    <iframe
      class="video-player"
      :src="generateUrl(config)"
      frameborder="0"
      scrolling="no"
			layout="video-with-chat"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { TwitchPlayerConfig } from "~/utils/pacman.interface";

@Component
export default class UserComponent extends Vue {
  private config: TwitchPlayerConfig = {
    channel: "faker",
    parent: "localhost",
    muted: true,
  };

  created() {}

  private generateUrl(config: TwitchPlayerConfig): string {
    return `https://player.twitch.tv/?channel=${config.channel}&parent=${config.parent}&muted=${config.muted}&font-size=small`;
  }
}
</script>

<style lang="scss" scoped>
.video-wrapper {
  width: 100%;
  padding-top: 56.9%;
  position: relative;

  .video-player {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;
  }
}
</style>
