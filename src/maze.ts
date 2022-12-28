export function maze(x:number,y:number) {
		let n=x*y-1;
		if (n<0) return new Error(`illegal maze dimensions (${x} x ${y} < 1)`);

		let horiz =Array(x+1).fill(0).map(()=>[])
		let verti =Array(x+1).fill(0).map(()=>[])
		let here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
		let path = [here];
		let unvisited = Array(x+2).fill(0)
		.map(()=>[])
		.map((el,j)=>
			Array(y+1).fill(0)
			.map((e2,k)=>
				(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1))
			)
		)

		while (n>0) {
			let potential = [
				[here[0]+1, here[1]],
				[here[0], here[1]+1],
				[here[0]-1, here[1]],
				[here[0], here[1]-1],
			]

			let neighbors = [];
			potential.forEach((el)=>{
				if (unvisited[el[0]+1][el[1]+1]) neighbors.push(el);
			})

			if (neighbors.length) {
				n = n-1;
				let next= neighbors[Math.floor(Math.random()*neighbors.length)];
				unvisited[next[0]+1][next[1]+1]= false;
				if (next[0] == here[0])
					horiz[next[0]][(next[1]+here[1]-1)/2]= true;
				else 
					verti[(next[0]+here[0]-1)/2][next[1]]= true;
				path.push(here = next);
			} else 
				here = path.pop();
		}
		return {x: x, y: y, horiz: horiz, verti: verti};
}

export function display(m, writeTo) {
	return new Promise((resolve, _reject) => {
		let text = [];
		for (let j= 0; j<m.x*2+1; j++) {
			let line = [];
			if (0 == j%2)
				for (let k=0; k<m.y*4+1; k++)
					if (0 == k%4) 
						line[k] = '+';
					else
						if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
							line[k] = ' ';
						else
							line[k] = '-';
			else
				for (let k=0; k<m.y*4+1; k++)
					if (0 == k%4)
						if (k>0 && m.horiz[(j-1)/2][k/4-1])
							line[k] = ' ';
						else
							line[k] = '|';
					else
						line[k] = ' ';
			if (0 == j) line[1] = line[2] = line[3] = ' ';
			if (m.x*2-1 == j) line[4*m.y]= ' ';
			text.push(line.join('')+'\r\n');
		}
		const OUTPUT = text.join('');
		if (typeof writeTo === 'function')
			writeTo(OUTPUT);
		resolve(OUTPUT);
	});
}
