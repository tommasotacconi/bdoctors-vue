<script>
    export default {
        data() {
            return {};
        },
        props: {
            simulatedSpecs: {
                type: Array,
            },
            user: {
                type: Object
            },
            img: {
                type: Object,
                validator({ src, atLoad, atError }) {
                    function isFn(f) {
                        return typeof f === 'function';
                    }

                    return src && typeof isFn(atLoad) && isFn(atError);
                }
            },
            cardIndexes: {
                type: Array,
                validator([chunkInd, ownInd]) {
                    function isNum() {
                        return typeof chunkInd === 'number';
                    }

                    return isNum(chunkInd) && isNum(ownInd);
                }
            },
        }
    }
</script>

<template>
    <div class="card card-sponsored" :class="{ 'simulated-card-sponsored': !user }">
        <img :src="img?.src ?? null" :alt="(user && `Foto profilo di ${user.first_name} ${user.last_name}`) ?? 'loading img'" style="aspect-ratio: 1;"
            @load="img?.atLoad(cardIndexes[0])" @error="img?.atError(cardIndexes[0], cardIndexes[1])">
        <div class="card-body">
            <h5 class="card-title">
                <template v-if="user">{{ user.first_name }} {{ user.last_name }}</template>
                <template v-else><div></div></template>
            </h5>
            <div class="card-text">
                <h6>Specializzazioni:</h6>
                <ul v-if="user" class="list-unstyled">
                    <li v-for="{ name } in user.specializations">
                        {{ name }}
                    </li>
                </ul>
                <ul v-else class="list-unstyled">
                    <li class="simulated-lines-content" v-for="simSpec in simulatedSpecs">
                        <div></div>
                        <div></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
	@use '../../styles/variables' as var;

    ul {
		width: 100%;
		text-align: start;
		padding-left: 0;
	}

	li {
		border: 2px solid white;
		margin-bottom: 5px;
		padding: 10px;
		border-radius: 20px
	}


	.card-sponsored {
        width: 18rem;
		background-color: #D8F9FF;
		border-radius: 40px;
		flex-direction: column;
		align-items: center;
		border: 0;
		text-align: center;
		flex-basis: 230px;
		border: 2px solid #FFCC00;
		transition: 0.8s;

		.card-body {
			align-self: normal;
		}
	}

	.card-sponsored:hover {
		scale: 1.1;
		cursor: pointer;
		/* border: 4px solid #FFCC00; */
		background-color: #FFCC00;
		color: #0033FF;
	}

	.card-sponsored:hover img {
		border: 2px solid #0033FF;
	}

	.card {
		img {
			border-radius: 50%;
			width: 70%;
			border: 2px solid var(--color-primary);
			margin-top: 10px;
		}

		&.no-profile-img {
			img {
				display: none;
			}
		}
	}
	
	.card-text {
		text-align: start;
	}

    /* Simulated elements style */
	$line: 1rem;
	$line-h: var.to-px(1.5 * $line);

	%simulated-element-bg {
		background: #eee;
		background: linear-gradient(110deg, #ececec 5%, #f5f5f5 13%, #ececec 21%);
		background-size: 200% 1000%;
		animation: 1.5s shine linear infinite;
	}

	.simulated-card-sponsored img {
		color: #ececec;
		@extend %simulated-element-bg;
	}

	.simulated-lines-content {
		$text-my: 8px;
		$interline: 4px;
		// height: 2 * $text-my + 2 * $line-h + $interline + 4px;
		padding: 0;
		
		div:first-child,
		div:nth-child(2) {
			margin: {
				top: $text-my;
				inline: 10px;
			}
			border-radius: 0.5em;
			height: $line-h;
			border-radius: 5px;
			@extend %simulated-element-bg;

		}

		div:nth-child(2) {
			width: 75%;
			margin: {
				top: $interline;
				bottom: $text-my;
			}
		}
	}

	h5.simulated-lines-content div:first-child {
		height: 1.3 * $line-h;
	}

	/* Loading animation */
	@keyframes shine {
		to {
			background-position-x: -200%;
		}
	}


</style>