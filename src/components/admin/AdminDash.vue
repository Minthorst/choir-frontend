<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {
  AdminMemberInfoResponse,
  addTickets,
  createMember,
  finalizeSession,
  getAllMembers,
  getAllSessions,
  getAttendingMembers,
  SessionResponse
} from "@/api/adminApi";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Modal from "@/components/ui/Modal.vue";

const router = useRouter()

const sessions = ref<SessionResponse[]>([])
const loading = ref(true)

const sortKey = ref<keyof SessionResponse>('startTime')
const sortDir = ref<'asc' | 'desc'>('desc')

const currentPage = ref(1)
const pageSize = 5

const selectedSession = ref<SessionResponse | null>(null)
const attendingMembers = ref<AdminMemberInfoResponse[]>([])
const showMembersModal = ref(false)

const finalizeResponse = ref('')
const finalizeStatus = ref('pending')

const allMembers = ref<AdminMemberInfoResponse[]>([])
const memberSearch = ref('')
const memberSortKey = ref<'name' | 'regularTickets' | 'commitTickets' | 'checkedIn'>('name')
const memberSortDir = ref<'asc' | 'desc'>('asc')
const memberPage = ref(1)
const memberPageSize = 5

const ticketInputs = ref<Record<number, { regular: number; commit: number }>>({})

const newMemberName = ref('')
const createdSecretKey = ref('')
const showCreatedModal = ref(false)

function createNewMember() {
  const name = newMemberName.value.trim()
  if (!name) return
  createMember(name, 0, 0).then((result) => {
    createdSecretKey.value = result.secretKey
    showCreatedModal.value = true
    newMemberName.value = ''
    loadMembers()
  })
}

function getTicketInput(id: number) {
  if (!ticketInputs.value[id]) {
    ticketInputs.value[id] = {regular: 0, commit: 0}
  }
  return ticketInputs.value[id]
}

function loadMembers() {
  getAllMembers().then((list) => {
    allMembers.value = list
  })
}

function sortMembersBy(key: 'name' | 'regularTickets' | 'commitTickets' | 'checkedIn') {
  if (memberSortKey.value === key) {
    memberSortDir.value = memberSortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    memberSortKey.value = key
    memberSortDir.value = 'asc'
  }
  memberPage.value = 1
}

const filteredMembers = computed(() => {
  const query = memberSearch.value.trim().toLowerCase()
  if (!query) return allMembers.value
  return allMembers.value.filter((m) => m.name.toLowerCase().includes(query))
})

const sortedMembers = computed(() => {
  const dir = memberSortDir.value === 'asc' ? 1 : -1
  return [...filteredMembers.value].sort((a, b) => {
    let av: any = a[memberSortKey.value]
    let bv: any = b[memberSortKey.value]
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
})

const memberTotalPages = computed(() => Math.max(1, Math.ceil(sortedMembers.value.length / memberPageSize)))
const memberPageItems = computed(() =>
    sortedMembers.value.slice((memberPage.value - 1) * memberPageSize, memberPage.value * memberPageSize))

function memberPageForward() {
  if (memberPage.value < memberTotalPages.value) memberPage.value++
}

function memberPageBack() {
  if (memberPage.value > 1) memberPage.value--
}

function addRegularTickets(member: AdminMemberInfoResponse) {
  const amount = getTicketInput(member.id).regular
  if (!amount) return
  addTickets(member.id, amount, 0).then(() => {
    getTicketInput(member.id).regular = 0
    loadMembers()
  })
}

function addCommitTickets(member: AdminMemberInfoResponse) {
  const amount = getTicketInput(member.id).commit
  if (!amount) return
  addTickets(member.id, 0, amount).then(() => {
    getTicketInput(member.id).commit = 0
    loadMembers()
  })
}

function loadSessions() {
  loading.value = true
  getAllSessions().then((list) => {
    sessions.value = list
    loading.value = false
  })
}

onMounted(() => {
  loadSessions()
  loadMembers()
})

function sortBy(key: keyof SessionResponse) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
  currentPage.value = 1
}

const sortedSessions = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...sessions.value].sort((a, b) => {
    let av: any = a[sortKey.value]
    let bv: any = b[sortKey.value]
    if (sortKey.value === 'startTime') {
      av = new Date(av as string).getTime()
      bv = new Date(bv as string).getTime()
    }
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedSessions.value.length / pageSize)))
const pageItems = computed(() =>
    sortedSessions.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function pageForward() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function pageBack() {
  if (currentPage.value > 1) currentPage.value--
}

function formatDatetime(iso: string) {
  return new Intl.DateTimeFormat('de-DE', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(iso))
}

function canFinalize(session: SessionResponse) {
  return session.sessionType === 'NONE' || session.sessionType === 'AUTO_CLOSE'
}

function viewMembers(session: SessionResponse) {
  selectedSession.value = session
  getAttendingMembers(session.id).then((list) => {
    attendingMembers.value = list
    showMembersModal.value = true
  })
}

function goToMember(member: AdminMemberInfoResponse) {
  showMembersModal.value = false
  router.push(`/member/${member.secretKey}`)
}

function finalize(session: SessionResponse, sessionType: string) {
  finalizeSession(session.id, sessionType)
      .then((result) => {
        finalizeResponse.value = `Finalized: ${result.presentMembers} present, ${result.absentCommitMembers} absent commit members charged`
        finalizeStatus.value = 'success'
        loadSessions()
      })
      .catch((e) => {
        finalizeResponse.value = e.message
        finalizeStatus.value = 'fail'
      })
}
</script>

<template>
  <base-card class="sessions-card">
    <template #header>
      <h3>Sessions</h3>
    </template>
    <table v-if="!loading && pageItems.length > 0">
      <thead>
      <tr>
        <th @click="sortBy('startTime')">Date {{ sortKey === 'startTime' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</th>
        <th @click="sortBy('sessionType')">Status {{ sortKey === 'sessionType' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</th>
        <th @click="sortBy('amountOfAttendees')">Attendees
          {{ sortKey === 'amountOfAttendees' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}
        </th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="session in pageItems" :key="session.id">
        <td>{{ formatDatetime(session.startTime) }}</td>
        <td>{{ session.sessionType }}</td>
        <td class="attendees" @click="viewMembers(session)">{{ session.amountOfAttendees }}</td>
        <td class="actions">
          <template v-if="canFinalize(session)">
            <base-button variant="secondary" @click="finalize(session, 'REGULAR_ONLY')">Regular Only</base-button>
            <base-button variant="secondary" @click="finalize(session, 'COMMIT')">Commit</base-button>
          </template>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else-if="!loading" class="empty">No sessions found</p>

    <div class="pagination" v-if="totalPages > 1">
      <base-button @click="pageBack">&lt;</base-button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <base-button @click="pageForward">&gt;</base-button>
    </div>
  </base-card>

  <base-card class="members-card">
    <template #header>
      <h3>Members</h3>
    </template>
    <input
        type="text"
        class="member-search"
        v-model="memberSearch"
        placeholder="Search by name..."
        @input="memberPage = 1"
    />
    <table v-if="memberPageItems.length > 0" class="members-table">
      <thead>
      <tr>
        <th @click="sortMembersBy('name')">Name
          {{ memberSortKey === 'name' ? (memberSortDir === 'asc' ? '▲' : '▼') : '' }}
        </th>
        <th @click="sortMembersBy('regularTickets')">Regular
          {{ memberSortKey === 'regularTickets' ? (memberSortDir === 'asc' ? '▲' : '▼') : '' }}
        </th>
        <th @click="sortMembersBy('commitTickets')">Commit
          {{ memberSortKey === 'commitTickets' ? (memberSortDir === 'asc' ? '▲' : '▼') : '' }}
        </th>
        <th @click="sortMembersBy('checkedIn')">Checked In
          {{ memberSortKey === 'checkedIn' ? (memberSortDir === 'asc' ? '▲' : '▼') : '' }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="member in memberPageItems" :key="member.id">
        <td class="member-name" @click="goToMember(member)">{{ member.name }}</td>
        <td class="ticket-cell">
          <span class="ticket-count">{{ member.regularTickets }}</span>
          <input type="number" min="1" v-model.number="getTicketInput(member.id).regular"/>
          <base-button variant="secondary" @click="addRegularTickets(member)">Add</base-button>
        </td>
        <td class="ticket-cell">
          <span class="ticket-count">{{ member.commitTickets }}</span>
          <input type="number" min="1" v-model.number="getTicketInput(member.id).commit"/>
          <base-button variant="secondary" @click="addCommitTickets(member)">Add</base-button>
        </td>
        <td>{{ member.checkedIn ? 'Yes' : 'No' }}</td>
      </tr>
      </tbody>
    </table>
    <p v-else class="empty">No members found</p>

    <div class="pagination" v-if="memberTotalPages > 1">
      <base-button @click="memberPageBack">&lt;</base-button>
      <span>{{ memberPage }} / {{ memberTotalPages }}</span>
      <base-button @click="memberPageForward">&gt;</base-button>
    </div>
  </base-card>

  <base-card class="add-member-card">
    <template #header>
      <h3>Add Member</h3>
    </template>
    <form class="add-member-form" @submit.prevent="createNewMember">
      <input type="text" v-model="newMemberName" placeholder="Member name"/>
      <base-button type="submit">Create</base-button>
    </form>
  </base-card>

  <modal class="success-modal" :is-open="showCreatedModal" @close="showCreatedModal = false">
    <p>Member created. Secret key:</p>
    <p class="secret-key">{{ createdSecretKey }}</p>
  </modal>

  <modal :is-open="showMembersModal" @close="showMembersModal = false">
    <h3>Attending Members</h3>
    <ul class="members-list">
      <li v-for="member in attendingMembers" :key="member.id" @click="goToMember(member)">
        {{ member.name }}
      </li>
      <li v-if="attendingMembers.length === 0" class="empty">No attendees</li>
    </ul>
  </modal>

  <modal class="success-modal" :is-open="finalizeStatus === 'success'" @close="finalizeStatus = 'pending'">
    <p>{{ finalizeResponse }}</p>
  </modal>
  <modal class="fail-modal" :is-open="finalizeStatus === 'fail'" @close="finalizeStatus = 'pending'">
    <p>{{ finalizeResponse }}</p>
  </modal>
</template>

<style scoped>
.success-modal :deep(.modal-content) {
  background-color: #15803d;
  color: #ffffff;
}

.fail-modal :deep(.modal-content) {
  background-color: #b91c1c;
  color: #ffffff;
}

.base-card.sessions-card {
  max-width: 640px;
}

.base-card.members-card {
  max-width: 760px;
}

.members-card {
  margin-top: 1.5rem;
}

.member-search {
  background-color: var(--bg);
  border: 1px solid var(--row-active);
  border-radius: var(--radius-sm);
  color: var(--fg);
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
  min-height: 2.75rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

.member-search:focus {
  outline: none;
  border-color: var(--accent);
}

.members-table {
  table-layout: fixed;
}

.members-table th:nth-child(1),
.members-table td:nth-child(1) {
  width: 26%;
}

.members-table th:nth-child(2),
.members-table td:nth-child(2),
.members-table th:nth-child(3),
.members-table td:nth-child(3) {
  width: 28%;
}

.members-table th:nth-child(4),
.members-table td:nth-child(4) {
  width: 18%;
}


.member-name {
  cursor: pointer;
  text-decoration: underline;
  color: var(--fg);
}

.add-member-card {
  max-width: 480px;
  margin-top: 1.5rem;
}

.add-member-form {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.add-member-form input {
  background-color: var(--bg);
  border: 1px solid var(--row-active);
  border-radius: var(--radius-sm);
  color: var(--fg);
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  flex: 1;
  min-width: 0;
  min-height: 2.75rem;
  box-sizing: border-box;
}

.add-member-form input:focus {
  outline: none;
  border-color: var(--accent);
}

.secret-key {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
}

.ticket-cell {
  vertical-align: middle;
  overflow: hidden;
}

.ticket-count {
  min-width: 1.2rem;
  display: inline-block;
}

.ticket-cell input {
  background-color: var(--bg);
  border: 1px solid var(--row-active);
  border-radius: var(--radius-sm);
  color: var(--fg);
  padding: 0.3rem 0.4rem;
  font-size: 0.85rem;
  font-family: inherit;
  width: 3rem;
  margin: 0 0.35rem;
  box-sizing: border-box;
}

.ticket-cell input:focus {
  outline: none;
  border-color: var(--accent);
}

.ticket-cell :deep(.base-button) {
  padding: 0.3rem 0.6rem;
  min-height: 0;
  font-size: 0.8rem;
  white-space: nowrap;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  cursor: pointer;
  user-select: none;
  color: var(--muted);
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.5rem 0.4rem;
  border-bottom: 1px solid var(--row-active);
  white-space: nowrap;
}

td {
  padding: 0.6rem 0.4rem;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--row-ghost);
}

.attendees {
  cursor: pointer;
  text-decoration: underline;
  color: var(--fg);
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  min-height: 2.75rem;
}

.empty {
  color: var(--muted);
  text-align: center;
  margin: 1rem 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.members-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}

.members-list li {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid var(--row-ghost);
  cursor: pointer;
}

.members-list li:last-child {
  border-bottom: none;
}

.members-list li:hover {
  background-color: var(--row-ghost);
}

@media (max-width: 480px) {
  th, td {
    font-size: 0.8rem;
    padding: 0.4rem 0.25rem;
  }
}
</style>
