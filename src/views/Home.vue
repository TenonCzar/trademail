<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";
const username = ref("");
const mail = ref([]);
const router = useRouter();
function createMail() {
    const user = username.value
    if (user.trim() === "") {
        alert("Please enter a username or use the auto-generate option.");
        return;
    }
    const domain = "ncub.site";
    const emailAddress = `${user}@${domain}`;
    localStorage.setItem("emailList", JSON.stringify([...mail.value, emailAddress]))
    mail.value.push(emailAddress);
    username.value = "";
}

function openMailBox(emailAddress) {
    router.push({
        name: 'mailbox',
        query: { email: emailAddress }
    })

}

onMounted(() => {
    const storedMails = JSON.parse(localStorage.getItem("emailList")) || [];
    mail.value = storedMails;
});

</script>

<template>
    <!-- Header Component -->
    <header class="flex items-center justify-between p-3 bg-gray-800 text-white">
        <RouterLink class="text-lg" to="/">
            Trade Mail
        </RouterLink>

    </header>

    <main class="flex flex-col gap-3 items-center p-2 bg-gray-900 text-white min-h-screen">
        <h1 class="head text-lg md:text-xl font-semibold text-center md:text-left">Trade Mail - Email Provider For All
            Services</h1>
        <p class="subline text-center">Create unlimited email accounts for all your services. Perfect for protecting
            your
            privacy.</p>

        <div class="mailArea border w-full max-w-3xl p-3 rounded bg-gray-800 gap-3 flex flex-col">
            <div class="head flex justify-between items-center w-full">Temporary Emails <button
                    class="rotate-40">()</button>
            </div>

            <div class="mailInput flex flex-col gap-4">
                <div class="username-area bg-gray-700 p-2 rounded divide-x flex items-center justify-between">
                    <form action="#" id="username" @submit.prevent="createMail">
                        <input v-model="username" type="text" name="username" id="username"
                            placeholder="Enter Username (optional)" class="outline-none bg-transparent">
                    </form>
                    <button id="randomName" class="flex items-center">
                        <Icon icon="sidekickicons:dice-20-solid" class="text-xl" />Auto(Rotate)
                    </button>
                </div>

                <button type="submit" form="username"
                    class="createMail rounded bg-orange-400 p-2 w-1/2 hover:bg-orange-700 cursor-pointer">+
                    Create
                    Mail</button>

                <div class="quick-btns flex justify-between items-center gap-3">
                    <button class="save w-full rounded-lg bg-blue-400 p-2 border border-gray-400">Save Inbox</button>
                    <button class="guide w-full rounded-lg bg-pink-500 p-2 border border-gray-400">Guide</button>
                    <button class="domain w-full rounded-lg bg-purple-500 p-2 border border-gray-400">Add
                        Domain</button>
                </div>

            </div>
        </div>
        <div class="mailBox w-full flex flex-col gap-4 max-w-3xl">
            <div class="top bg-white rounded-lg border-2 border-gray-400"> <input type="search" name="searchMails"
                    id="searchMails" placeholder="Search emails..." class="w-full p-2 text-gray-700"></div>

            <div class="mails">
                <div v-if="!mail.length" class="noMail flex flex-col-reverse items-center text-center gap-3 p-6">
                    <p class="text-center text-gray-400">No emails to show. Ready When You Are! Just hit Create above to
                        get your
                        instant temporary email.</p>
                    <Icon icon="flowbite:envelope-open-outline" class="text-8xl" />
                </div>

                <div v-else class="mainItem flex flex-col gap-3">
                    <!-- Mails Showing Here -->
                    <div class="mailList text-xl bg-gray-600 rounded w-full flex justify-between items-center p-2 lowercase cursor-pointer hover:bg-gray-700"
                        v-for="email in mail" :key="email" @click="openMailBox(email)">{{ email }}
                        <Icon icon="meteor-icons:angle-right" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped></style>
