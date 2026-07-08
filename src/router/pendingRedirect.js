let pendingRedirect = '/'

export function setPendingRedirect(path) {
    pendingRedirect = path
}

export function consumePendingRedirect() {
    const value = pendingRedirect
    pendingRedirect = '/'
    return value
}
