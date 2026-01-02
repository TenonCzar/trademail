<script setup>
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'

const route = useRoute()
const emailAddress = ref(route.query.email)
const mails = ref([])
const loading = ref(false)

async function loadMailBox(email) {
    if (!email) return

    loading.value = true
    mails.value = []

    try {
        // 1. Fetch mailbox list
        const response = await fetch(
            `https://corsproxy.io/?https://api.catchmail.io/api/v1/mailbox?address=${encodeURIComponent(email)}`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch mailbox')
        }

        const data = await response.json()

        // IMPORTANT
        const messages = data.messages || []

        // 2. Fetch body for each message
        const enrichedMessages = await Promise.all(
            messages.map(async (msg) => {
                try {
                    const msgRes = await fetch(
                        `https://corsproxy.io/?https://api.catchmail.io/api/v1/message/${msg.id}?mailbox=${encodeURIComponent(email)}`
                    )

                    if (!msgRes.ok) {
                        throw new Error('Failed to fetch message body')
                    }

                    const msgData = await msgRes.json()

                    return {
                        ...msg,
                        body: msgData.body || '<em>No body available</em>'
                    }
                } catch (err) {
                    console.error(`Failed loading message ${msg.id}`, err)
                    return {
                        ...msg,
                        body: '<em>Failed to load message body</em>'
                    }
                }
            })
        )

        mails.value = enrichedMessages
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadMailBox(emailAddress.value)
})

watch(
    () => route.query.email,
    (newEmail) => {
        emailAddress.value = newEmail
        loadMailBox(newEmail)
    }
)
</script>


<template>
    <main class="flex flex-col gap-3 items-center p-2 bg-gray-900 text-white min-h-screen">
        <h1 class="head">Mail Box</h1>
        <p class="subline">
            Viewing emails for:
            <strong>{{ emailAddress }}</strong>
        </p>

        <div class="mailsDisplay w-full max-w-3xl">
            <div v-if="loading" class="text-center p-5 bg-gray-800 rounded">
                Loading mailbox…
            </div>

            <div v-else-if="mails.length === 0" class="text-center p-5 bg-gray-800 rounded">
                No emails found for this address.
            </div>

            <div v-else class="mail-list flex flex-col gap-3">
                <div v-for="mail in mails" :key="mail.id" class="mail-item border p-3 rounded bg-gray-800">
                    <h2 class="mail-subject font-semibold">
                        {{ mail.subject }}
                    </h2>

                    <p class="mail-from text-sm text-gray-400">
                        From: {{ mail.from }}
                    </p>

                    <p class="mail-date text-xs text-gray-500">
                        {{ new Date(mail.date).toLocaleString() }}
                    </p>

                    <div class="mail-body mt-3 prose prose-invert max-w-none" v-html="mail.body?.text"></div>
                </div>
            </div>
        </div>
    </main>
</template>
