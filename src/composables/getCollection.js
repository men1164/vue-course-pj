import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'

const getCollection = (collection, query) => {
    const documents = ref(null)
    const error = ref(null)

    let collectionRef = projectFirestore.collection(collection).orderBy('created_at')

    if(query) {
        collectionRef = collectionRef.where(...query) // spread array value
    }

    const unsub = collectionRef.onSnapshot((snap) => {
        let results = []
        
        snap.docs.forEach(doc => {
            doc.data().created_at && results.push({ ...doc.data(), id: doc.id }) // wait for timestamps created on server
        })

        documents.value = results
        error.value = null
    }, (err) => {
        console.log(err.message)
        documents.value = null
        error.value = 'Cou;ld not fetch the data'
    })

    watchEffect((onInvalidate) => {
        // unsub from prev collection when watcher is stopped
        onInvalidate(() => {
            unsub()
        })
    })

    return { documents, error }
}

export default getCollection