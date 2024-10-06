// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devServer: {
    port: 3000,
  },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.ico",
        },
        {
          rel: "manifest",
          href: "/manifest/manifest.json",
        },
        {
          rel: "apple-touch-icon",
          href: "/icon/logo.png",
        },
      ],
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content:
            "faser app, social media app, microblogging, post short messages, online community, social network, app for short posts, social platform, microblogging platform, app for discussions, share trends, social media interactions, gain followers, create posts, social sharing, social networks, social media exchange, trending topics, user-generated content, social connection",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black",
        },
      ],
    },
  },
});
