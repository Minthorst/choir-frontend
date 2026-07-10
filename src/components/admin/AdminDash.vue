<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
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
import ResultModal from "@/components/ui/ResultModal.vue";

const sessions = ref<SessionResponse[]>([])
const loading = ref(true)

const sortKey = ref<keyof SessionResponse>('startTime')
const sortDir = ref<'asc' | 'desc'>('desc')

const currentPage = ref(1)
const pageSize = 5

const selectedSession = ref<SessionResponse | null>(null)
const attendingMembers = ref<AdminMemberInfoResponse[]>([])
const showMembersModal = ref(false)
const showSessionModal = ref(false)

const finalizeResponse = ref('')
const finalizeStatus = ref('pending')

const allMembers = ref<AdminMemberInfoResponse[]>([])
const memberSearch = ref('')
const memberSortKey = ref<'name' | 'regularTickets' | 'commitTickets' | 'checkedIn'>('name')
const memberSortDir = ref<'asc' | 'desc'>('asc')
const memberPage = ref(1)
const memberPageSize = 5

const ticketInputs = ref<Record<number, { regular: number; commit: number }>>({})

const selectedMemberId = ref<number | null>(null)
const showMemberModal = ref(false)
const selectedMember = computed(() => allMembers.value.find((m) => m.id === selectedMemberId.value) ?? null)

function openMemberDetail(member: AdminMemberInfoResponse) {
  selectedMemberId.value = member.id
  showMemberModal.value = true
}

const newMemberName = ref('')
const createdSecretKey = ref('')
const showCreatedModal = ref(false)
const createMemberStatus = ref('pending')
const createMemberError = ref('')

function createNewMember() {
  const name = newMemberName.value.trim()
  if (!name) return
  createMember(name, 0, 0).then((result) => {
    createdSecretKey.value = result.secretKey
    showCreatedModal.value = true
    newMemberName.value = ''
    loadMembers()
  }).catch((e) => {
    createMemberError.value = e.message
    createMemberStatus.value = 'fail'
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

function openSessionDetail(session: SessionResponse) {
  selectedSession.value = session
  showSessionModal.value = true
}

function finalize(session: SessionResponse, sessionType: string) {
  finalizeSession(session.id, sessionType)
      .then((result) => {
        finalizeResponse.value = `Finalized: ${result.presentMembers} present, ${result.absentCommitMembers} absent commit members charged`
        finalizeStatus.value = 'success'
        showSessionModal.value = false
        loadSessions()
      })
      .catch((e) => {
        finalizeResponse.value = e.message
        finalizeStatus.value = 'fail'
      })
}
</script>

<template>
  <base-card collapsible :default-open="false" class="sessions-card">
    <template #header>
      <h3>Sessions</h3>
    </template>
    <div class="table-scroll" v-if="!loading && pageItems.length > 0">
      <table class="sessions-table">
        <thead>
        <tr>
          <th @click="sortBy('startTime')">Date {{ sortKey === 'startTime' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</th>
          <th @click="sortBy('sessionType')">Status {{ sortKey === 'sessionType' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</th>
          <th @click="sortBy('amountOfAttendees')">Attendees
            {{ sortKey === 'amountOfAttendees' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="session in pageItems" :key="session.id">
          <td>{{ formatDatetime(session.startTime) }}</td>
          <td :class="{ 'needs-action': canFinalize(session) }"
              @click="canFinalize(session) && openSessionDetail(session)">
            {{ session.sessionType }}
          </td>
          <td class="clickable-cell" @click="viewMembers(session)">{{ session.amountOfAttendees }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="!loading" class="empty">No sessions found</p>

    <div class="pagination" v-if="totalPages > 1">
      <base-button @click="pageBack">&lt;</base-button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <base-button @click="pageForward">&gt;</base-button>
    </div>
  </base-card>

  <base-card collapsible :default-open="false" class="members-card">
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
    <div class="table-scroll" v-if="memberPageItems.length > 0">
      <table class="members-table">
        <thead>
        <tr>
          <th @click="sortMembersBy('name')">Name
            {{ memberSortKey === 'name' ? (memberSortDir === 'asc' ? '▲' : '▼') : '' }}
          </th>
          <th @click="sortMembersBy('checkedIn')">Currently Checked In
            {{ memberSortKey === 'checkedIn' ? (memberSortDir === 'asc' ? '▲' : '▼') : '' }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="member in memberPageItems" :key="member.id">
          <td class="clickable-cell" @click="openMemberDetail(member)">{{ member.name }}</td>
          <td>{{ member.checkedIn ? 'Yes' : 'No' }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="empty">No members found</p>

    <div class="pagination" v-if="memberTotalPages > 1">
      <base-button @click="memberPageBack">&lt;</base-button>
      <span>{{ memberPage }} / {{ memberTotalPages }}</span>
      <base-button @click="memberPageForward">&gt;</base-button>
    </div>
  </base-card>

  <base-card collapsible :default-open="false" class="add-member-card">
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
  <result-modal :status="createMemberStatus" :message="createMemberError" @close="createMemberStatus = 'pending'"/>

  <modal :is-open="showMembersModal" @close="showMembersModal = false">
    <h3>Attending Members</h3>
    <ul class="members-list">
      <li v-for="member in attendingMembers" :key="member.id" @click="openMemberDetail(member)">
        {{ member.name }}
      </li>
      <li v-if="attendingMembers.length === 0" class="empty">No attendees</li>
    </ul>
  </modal>

  <modal :is-open="showSessionModal" @close="showSessionModal = false">
    <h3 v-if="selectedSession">{{ formatDatetime(selectedSession.startTime) }}</h3>
    <p class="session-status" v-if="selectedSession">Status: {{ selectedSession.sessionType }}</p>
    <div class="session-actions" v-if="selectedSession && canFinalize(selectedSession)">
      <base-button variant="secondary" @click="finalize(selectedSession, 'REGULAR_ONLY')">Regular Only</base-button>
      <base-button variant="secondary" @click="finalize(selectedSession, 'COMMIT')">Commit</base-button>
    </div>
  </modal>

  <result-modal :status="finalizeStatus" :message="finalizeResponse" @close="finalizeStatus = 'pending'"/>

  <modal :is-open="showMemberModal" @close="showMemberModal = false">
    <template v-if="selectedMember">
      <h3>{{ selectedMember.name }}</h3>
      <p class="member-secret-key">Secret Key: {{ selectedMember.secretKey }}</p>
      <div class="member-tickets">
        <div class="ticket-row">
          <span>Regular Tickets: {{ selectedMember.regularTickets }}</span>
          <input type="number" min="1" v-model.number="getTicketInput(selectedMember.id).regular"/>
          <base-button variant="secondary" @click="addRegularTickets(selectedMember)">Add</base-button>
        </div>
        <div class="ticket-row">
          <span>Commit Tickets: {{ selectedMember.commitTickets }}</span>
          <input type="number" min="1" v-model.number="getTicketInput(selectedMember.id).commit"/>
          <base-button variant="secondary" @click="addCommitTickets(selectedMember)">Add</base-button>
        </div>
      </div>
    </template>
  </modal>
</template>

<style scoped>
.base-card.sessions-card,
.base-card.members-card,
.base-card.add-member-card {
  max-width: 760px;
}

.members-card {
  margin-top: 1.5rem;
}

.member-search {
  width: 100%;
  margin-bottom: 1rem;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.sessions-table th:nth-child(1),
.sessions-table td:nth-child(1) {
  width: 40%;
}

.needs-action {
  color: var(--danger);
  cursor: pointer;
  text-decoration: underline;
}

.session-status {
  color: var(--muted);
  margin: 0.5rem 0 0;
}

.session-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.members-table th:nth-child(1),
.members-table td:nth-child(1) {
  width: 60%;
}

.clickable-cell {
  cursor: pointer;
  text-decoration: underline;
  color: var(--fg);
}

.add-member-card {
  margin-top: 1.5rem;
}

.add-member-form {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.add-member-form input {
  flex: 1;
  min-width: 0;
}

.secret-key {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
}

.member-secret-key {
  font-family: monospace;
  color: var(--muted);
  text-align: center;
  margin-top: 0.25rem;
}

.member-tickets {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-top: 1.25rem;
}

.ticket-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ticket-row span {
  flex: 1;
  text-align: left;
}

.ticket-row input {
  width: 4rem;
}

td {
  border-bottom: 1px solid var(--row-ghost);
}

.empty {
  color: var(--muted);
  text-align: center;
  margin: 1rem 0;
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
</style>
