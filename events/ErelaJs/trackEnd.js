/* eslint-disable no-unused-vars */
module.exports = {
	name: 'trackEnd',
	async execute(client, player, track, payload) {

		const autoplay = player.get("autoplay");
        if (autoplay) {
            if (player.queue.length > 0) return;

			const requester = player.get("requester");
            const identifier = player.get("identifier") || player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            let res = await player.search(search, requester);

            player.queue.add(res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 2]);
            if (!player.playing && !player.paused && !player.queue.size) player.play();
        }

    }
}