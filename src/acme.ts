type rugInfo = {
    name: string, 
    w: number, 
    h: number, 
    color: string, 
    img: string
}

const pixelsPerFoot = 20
var initialX = 0
var initialY = 0
var activeRugW = 0
var activeRugH = 0

const widthElement = document.getElementById('room-width') as HTMLInputElement
const heightElement = document.getElementById('room-height') as HTMLInputElement
const widthElementValue = document.getElementById('room-width-value') as HTMLSpanElement
const heightElementValue = document.getElementById('room-height-value') as HTMLSpanElement
const catalog = document.getElementById('rugs-catalog') as HTMLDivElement
const walls = document.getElementById('the-walls') as HTMLDivElement
const room = document.getElementById('the-room') as HTMLDivElement

addGrid(room)

room.addEventListener('drop', (e) => dropRug(e))
room.addEventListener('dragenter', (e) => dragEnterRug(e))
room.addEventListener('dragover', (e) => dragOverRug(e))
room.addEventListener('dragleave', (e) => dragLeaveRug(e))

widthElement.addEventListener('input', roomSize)
heightElement.addEventListener('input', roomSize)

const catalogOfOfRugs: rugInfo[] = [
    {name: 'Rug 1<span>7x10</span>', w: 7, h: 10, color: 'red', img: 'img/CarpetC.jpg'},
    {name: 'Rug 2<span>12x12</span>', w: 12, h: 12, color: 'green', img: 'img/CarpetB.png'},
    {name: 'Rug 3<span>12x6</span>', w: 12, h: 6, color: 'blue', img: 'img/CarpetD.png'},
]

for(let i=1; i<=3; i++) {
    addRugToCatalog(catalogOfOfRugs[i-1])
}

//---------------------------------------------------------------------
// FUNCTIONS 
function addGrid(room: HTMLDivElement) {
    for(let i=1; i<100; i++) {
        const v = document.createElement('div')
        v.style.width = '1px'
        v.style.height = '100%'
        v.style.borderLeft = 'dotted 1px #ccc'
        v.style.position = 'absolute'
        v.style.top = '0'
        v.style.bottom = '0'
        v.style.left = (i * pixelsPerFoot) + 'px'
        room.appendChild(v)

        const h = document.createElement('div')
        h.style.width = '100%'
        h.style.height = '1px'
        h.style.borderTop = 'dotted 1px #ccc'
        h.style.position = 'absolute'
        h.style.left = '0'
        h.style.right = '0'
        h.style.top = (i * pixelsPerFoot) + 'px'
        room.appendChild(h)
    }
}

function removeActiveRug() {
    const rug = document.getElementById('active-rug')
    if(rug) {
        room.removeChild(rug)
    }
}

function addRugToCatalog(rugInfo: rugInfo) {
    const li = document.createElement('li')
    li.innerHTML = rugInfo.name
    const thumbnail = document.createElement('img')
    thumbnail.style.maxWidth = '62px'
    thumbnail.style.paddingTop = '4px'
    thumbnail.src = rugInfo.img
    li.appendChild(thumbnail)
    li.addEventListener('click', () => room.appendChild(createRug(rugInfo)))
    catalog.appendChild(li)
}

function createRug(rugInfo: rugInfo) {
    removeActiveRug()
    const rug = document.createElement('div')
    rug.style.position = 'absolute'
    rug.style.width = `${rugInfo.w * pixelsPerFoot}px`
    rug.style.height = `${rugInfo.h * pixelsPerFoot}px`
    rug.style.top = `0`
    rug.style.left = `0`
    rug.id = 'active-rug'
    rug.draggable = true
    if(rugInfo.img) {
        rug.style.backgroundImage = `url(${rugInfo.img})`
        rug.style.backgroundSize = `${rugInfo.w * pixelsPerFoot}px ${rugInfo.h * pixelsPerFoot}px`
    } else {
        rug.style.backgroundColor = rugInfo.color
    }

    rug.addEventListener('dragstart', (e) => dragStartRug(e))
    rug.addEventListener('drag', (e) => dragRug(e))
    rug.addEventListener('dragend', (e) => dragEndRug(e))

    activeRugW = rugInfo.w * pixelsPerFoot
    activeRugH = rugInfo.h * pixelsPerFoot

    return rug
}

// --------------------------------------------------------------------
// Events on dragged Element
function dragStartRug(e: DragEvent) {
    const draggedElement = e.target as HTMLElement
    draggedElement.style.cursor = 'move'
    e.dataTransfer!.setData('text/plain', draggedElement.id)
    setTimeout(() => {
        draggedElement.style.visibility='hidden'
        draggedElement.style.border = 'dashed 1px #888'
    }, 0)
    initialX = e.offsetX
    initialY = e.offsetY
    console.log(`Start rug drag... initialXY = (${initialX}, ${initialY})`)
}

function dragRug(e: DragEvent) {
}

function dragEndRug(e: DragEvent) {
    const draggedElement = e.target as HTMLElement
    setTimeout(() => draggedElement.style.visibility='visible', 0)
}

// --------------------------------------------------------------------
// Events on target Element
function dragEnterRug(e: DragEvent) {
    e.preventDefault()
}

function dragOverRug(e: DragEvent) {
    e.preventDefault()
}

function dragLeaveRug(e: DragEvent) {
}

function dropRug(e: DragEvent) {
    const rug = document.getElementById('active-rug') as HTMLElement
    if(e.offsetX>=0) {
        rug.style.left = roundGridPosition(e.offsetX - initialX, room.clientWidth - activeRugW) + 'px'
    }
    if(e.offsetY>=0) {
        rug.style.top = roundGridPosition(e.offsetY - initialY, room.clientHeight - activeRugH) + 'px'
    }
}

function roundGridPosition(value: number, maxValue: number) {
    const pos = Math.floor((value + pixelsPerFoot/2) / pixelsPerFoot) * pixelsPerFoot
    var ret =  pos < 0 ? 0 : (pos > maxValue ? maxValue : pos)
    return ret
}

function roomSize() {
    const width = parseInt(widthElement.value)
    const height = parseInt(heightElement.value)

    walls.style.width = (width * pixelsPerFoot).toFixed() + 'px'
    walls.style.height = (height * pixelsPerFoot).toFixed() + 'px'

    heightElementValue.innerHTML = `${height.toFixed()} ft`
    widthElementValue.innerHTML = `${width.toFixed()} ft`
}
