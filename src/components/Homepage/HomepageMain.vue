<script>
	import SponsoredDoctors from './SponsoredDoctors.vue';

	export default {
		data() {
			return {
				loaded: false,

			}
		},
		components: {
			SponsoredDoctors,
		},
		computed: {
		},
		mounted() {
		},
	}
</script>

<template>
	<Loader v-show="!loaded" />

	<main id="home-main" v-show="loaded">
		<div class="introduction-position">
			<div class="container-introduction">
				<div class="introduction flex-wrap flex-lg-nowrap">
					<div class="container container-text-introduction">
						<div>
							<h2>BDOCTORS: Trova lo specialista che fa al caso tuo!</h2>

							<p>Nessuna registrazione - nessun problema! <br>Manda direttamente una richiesta al medico
								che
								preferisci e verrai comodamente contattato alla mail indicata.
							</p>
						</div>
						<div>
							<a class="btn" href="#sponsored-doctors">Scopri i nostri dottori
								in
								evidenza!</a>
						</div>
					</div>
					<img class="img-doctors"
						src="https://img.freepik.com/premium-vector/medical-staff-team-concept-team-doctors-uniform-standing-together-vector-illustration_77116-2252.jpg"
						alt="">

				</div>
			</div>
		</div>
		<SponsoredDoctors id="sponsored-doctors" @loaded-sponsored-profiles="() => loaded = true" />
	</main>
</template>

<style scoped>

	/* Common style and normal doctor */
	h2 {
		text-align: center;
		margin-bottom: 20px;
	}

	a {
		color: var(--color-primary);
		text-decoration: none;
	}

	main#home-main {
		height: 100%;
		overflow: auto;
		padding-top: 0;
	}

	.introduction {
		min-height: 450px;
		display: flex;
		align-items: center;
		background: rgb(101, 176, 255);
		background: linear-gradient(90deg, rgba(101, 176, 255, 1) 0%, rgba(255, 255, 255, 1) 38%);
		text-align: center;
		justify-content: center;
		gap: 20px;
	}

	.introduction {
		p {
			font-weight: 500;
			font-style: italic;
		}

		img.img-doctors {
			width: 250px;
		}
	}

	/* #sponsored-doctors {
		position: relative;
		top: -20px;
		left: 0;
	} */

	a.btn {
		color: #fff;
	}

	.container-text-introduction {
		padding-top: calc(var(--header-border-r) + 50px);
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.card-container {
		display: flex;
		gap: 20px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.card-container .card {
		border-radius: 40px;
		background-color: #D8F9FF;
		flex-direction: column;
		align-items: center;
		border: 0;
		text-align: center;
		flex-basis: 240px;
	}

	.card img {
		border-radius: 50%;
		width: 70%;
		border: 1px solid var(--color-primary);
		margin-top: 10px;
	}


	/* Media queries */
	@media screen and (min-width: 992px) {
		.introduction {
			justify-content: center;

			.container-text-introduction {
				padding-top: 0;
			}

			img.img-doctors {
				width: auto;
			}
		}
	}
</style>