export function gaussianElimination(arr: number[]): number {
    let idx = 0; const n = arr[idx++];
    const mat: number[][] = Array.from({length:n}, () => { const row: number[] = []; for (let j=0;j<=n;j++) row.push(arr[idx++]); return row; });
    for (let col=0;col<n;col++) {
        let maxRow=col;
        for (let row=col+1;row<n;row++) if (Math.abs(mat[row][col])>Math.abs(mat[maxRow][col])) maxRow=row;
        [mat[col],mat[maxRow]]=[mat[maxRow],mat[col]];
        for (let row=col+1;row<n;row++) {
            if (mat[col][col]===0) continue;
            const f=mat[row][col]/mat[col][col];
            for (let j=col;j<=n;j++) mat[row][j]-=f*mat[col][j];
        }
    }
    const sol=new Array(n).fill(0);
    for (let i=n-1;i>=0;i--) {
        sol[i]=mat[i][n];
        for (let j=i+1;j<n;j++) sol[i]-=mat[i][j]*sol[j];
        sol[i]/=mat[i][i];
    }
    return Math.round(sol.reduce((a:number,b:number)=>a+b,0));
}

console.log(gaussianElimination([2, 1, 1, 3, 2, 1, 4]));
console.log(gaussianElimination([2, 1, 0, 5, 0, 1, 3]));
console.log(gaussianElimination([1, 2, 6]));
console.log(gaussianElimination([3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9]));
