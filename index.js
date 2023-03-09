const canvas = document.querySelector('#move-line')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

function getRandom(min, max) {
    return Math.random() * (max - min) + min
}

class Point {
    constructor(r, xSpeed, ySpeed) {
        this.r = r
        this.x = getRandom(r, canvas.width - r)
        this.y = getRandom(r, canvas.height - r)
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
        this.timestamp = null
    }
    draw() {
        ctx.beginPath()
        let x, y;
        if (this.timestamp) {
            const relTime = (Date.now() - this.timestamp) / 1000
            x = this.x + relTime * this.xSpeed
            y = this.y + relTime * this.ySpeed
            if (x >= (canvas.width - this.r)) {
                this.xSpeed = -this.xSpeed
                x = canvas.width - this.r
            }
            if (x <= 0) {
                this.xSpeed = -this.xSpeed
                x = this.r
            }
            if (y >= (canvas.height - this.r)) {
                this.ySpeed = -this.ySpeed
                y = canvas.height - this.r
            }
            if (y <= 0) {
                this.ySpeed = -this.ySpeed
                y = this.r
            }
            this.timestamp = Date.now()
        } else {
            x = this.x
            y = this.y
            this.timestamp = Date.now()
        }
        this.x = x
        this.y = y
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.fillStyle = '#fff'
        ctx.fill()
    }
}

class Graph {
    constructor(num, maxDis, r) {
        this.points = new Array(num).fill().map(() => new Point(r, getRandom(-100, 100), getRandom(-100, 100)))
        this.maxDis = maxDis
        this.init()
    }
    init() {
        requestAnimationFrame(() => this.init())
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].draw()
            for (let j = 0; j < this.points.length; j++) {
                if (j === i) continue
                const x = this.points[i].x - this.points[j].x,
                    y = this.points[i].y - this.points[j].y,
                    dis = Math.sqrt(x * x + y * y)
                if (dis > this.maxDis) continue
                ctx.beginPath()
                ctx.moveTo(this.points[i].x, this.points[i].y)
                ctx.lineTo(this.points[j].x, this.points[j].y)
                ctx.strokeStyle = `rgba(255,255,255,${dis / this.maxDis})`
                ctx.stroke()
            }
        }
    }
}

new Graph(30, 300, 6)
