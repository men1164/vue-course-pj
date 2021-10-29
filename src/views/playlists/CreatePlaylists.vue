<template>
    <form @submit.prevent="handleSubmit">
        <h4>Create New Playlists</h4>
        <input type="text" placeholder="Playlist title" v-model="title" required>
        <textarea placeholder="Playlist description..." v-model="description" required></textarea>
        <label>Upload Playlist Cover Image</label>
        <input type="file" @change="handleChange">
        <div class="error">{{ fileError }}</div>
        <button v-if="!isPending">Create</button>
        <button v-else disabled>Saving...</button>
    </form>
</template>

<script>
import { ref } from '@vue/reactivity'
import useStorage from '@/composables/useStorage'
import getUser from '../../composables/getUser'
import useCollection from '../../composables/useCollection'
import { timestamp } from '../../firebase/config'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const title = ref('')
        const description = ref('')
        const file = ref(null)
        const fileError = ref(null)
        const isPending = ref(false)

        const router = useRouter()

        const { url, filePath, uploadImage } = useStorage()
        const { error, addDoc } = useCollection('playlists')
        const { user } = getUser()

        const handleSubmit = async () => {
            if(file.value) {
                isPending.value = true
                await uploadImage(file.value)
                // console.log('image uploaded, url: ', url.value);
                const res = await addDoc({
                    title: title.value,
                    description: description.value,
                    userID: user.value.uid,
                    userName: user.value.displayName,
                    coverUrl: url.value,
                    filePath: filePath.value,
                    songs: [],
                    created_at: timestamp()
                })
                isPending.value = false
                if(!error.value) {
                    router.push({ name: 'PlaylistDetails', params: { id: res.id }})
                }
            }
        }

        // allow file types
        const types = ['image/png', 'image/jpeg']

        const handleChange = e => {
            const selected = e.target.files[0]

            if(selected && types.includes(selected.type)) {
                file.value = selected
                fileError.value = null
            }
            else {
                file.value = null
                fileError.value = 'Please select an image file (png or jpg)'
            }
        }

        return { title, description, handleSubmit, handleChange, fileError, isPending }
    }
}
</script>

<style>
input[type="file"] {
    border: 0;
    padding: 0;
}

label {
    font-size: 12px;
    display: block;
    margin-top: 30px;
}

button {
    margin-top: 20px;
}
</style>