<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import MemberView from "@/components/member/MemberView.vue";
import {Member, MemberResponse} from "@/types/member";
import {AttendanceResponse} from "@/types/attendance";

const router = useRouter()
const route = useRoute()
const secretKey = route.params.secretKey
const loading = ref(true)
const memberData = ref<Member | null>(null)

function loginMember() {

}

function getMemberData() {
  loading.value = true
  const memberUrl = 'http://localhost:8080/member/' + secretKey
  fetch(memberUrl)
      .then((response) => {
        return response.json();
      })
      .then((data: MemberResponse) => {
            if (data) {
              loading.value = false
              memberData.value = {
                name: data.name,
                commitTickets: data.commitTickets,
                regularTickets: data.regularTickets,
                pastAttendance: data.pastAttendances.map((a: AttendanceResponse) => ({
                  dateTime: a.attendedOn,
                  status: a.status
                }))
              }
            }
          }
      )
      .catch((error) => {
        //TODO custom Exception here
        loading.value = false
        if (error.status === 404) {
          alert('secret key incorrect')
        } else {
          alert('Member Data could not be retrieved' + error.message)
        }
        router.push({name: 'member-login'})
      })
}

onMounted(async () => {
  try {
    getMemberData()
  } catch (e) {

  } finally {
    loading.value = false
  }
})
</script>

<template>
  <member-view v-if="memberData" :member-data="memberData"></member-view>
  <p v-else>loading...</p>
</template>

<style scoped>

</style>