// Recuperando lista de notas
const list_notas = {
	play: document.querySelector('.play'),
	pause: document.querySelector('.pause'),
	$do: document.querySelector('.do'),
	$re: document.querySelector('.re'),
	$mi: document.querySelector('.mi'),
	$fa: document.querySelector('.fa'),
	$sol: document.querySelector('.sol'),
	$la: document.querySelector('.la'),
	$si: document.querySelector('.si')
}

// Desestruturando o objeto list_notas
const { play, pause, $do, $re, $mi, $fa, $sol, $la, $si } = list_notas

// Recuperando audios das notas.
const audios = document.querySelectorAll('audio')

// Tansformando nodelist em array.
const notas = [...audios]

// Evento das notas
$do.addEventListener('click', e => notas[0].play())
$re.addEventListener('click', e => notas[1].play())
$mi.addEventListener('click', e => notas[2].play())
$fa.addEventListener('click', e => notas[3].play())
$sol.addEventListener('click', e => notas[4].play())
$la.addEventListener('click', e => notas[5].play())
$si.addEventListener('click', e => notas[6].play())

// Recuperando video e texto com nome da música
const songname = document.querySelector('.songname')
const video = document.querySelector('.video')

// Controllers Video
play.addEventListener('click', e => { 
	songname.innerHTML = 'Tocando: Still D.R.E ft.Snoop Dogg [Piano]'
	songname.style.marginTop = '10px'

	video.style.display = 'block'
	video.play()
})

pause.addEventListener('click', e => {
	songname.innerHTML = 'Pausado'
	video.pause()
})


// Keyboard event
function keydown(event){
	if(event.keyCode === 49 || event.which === 65){
		notas[0].play()
	} else if(event.keyCode === 50 || event.which === 83){
		notas[1].play()
	} else if(event.keyCode === 51 || event.which === 68){
		notas[2].play()
	} else if(event.keyCode === 52 || event.which === 70){
		notas[3].play()
	} else if(event.keyCode === 53 || event.which === 71){
		notas[4].play()
	} else if(event.keyCode === 54 || event.which === 72){
		notas[5].play()
	} else if(event.keyCode === 55 || event.which === 74){
		notas[6].play()
	}
}

document.body.addEventListener('keydown', keydown)
