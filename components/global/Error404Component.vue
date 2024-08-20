<template>
  <main
    class="grid min-h-full place-items-center bg-white dark:bg-black px-6 py-24 sm:py-32 lg:px-8"
  >
    <div class="text-center">
      <p class="text-base font-semibold text-drive-500">404</p>
      <h1
        class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-700 sm:text-5xl"
      >
        Page not found
      </h1>
      <p class="mt-6 text-base leading-7 text-gray-600">
        Sorry, we couldn’t find the folder you’re looking for.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <RouterLink
          to="/"
          class="rounded-md bg-drive-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-drive-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-drive-600"
          >Go back home</RouterLink
        >
      </div>
    </div>
  </main>
</template>
