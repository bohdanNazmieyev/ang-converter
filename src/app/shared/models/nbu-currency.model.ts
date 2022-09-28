export class NbuCurrency {
    r030: number;
    txt: string;
    rate: number;
    cc: string;
    exchangedate: string;

    constructor(
        r030: number,
        txt: string,
        rate: number,
        cc: string,
        exchangedate: string
    ) {
        this.r030 = r030;
		this.txt = txt;
		this.rate = rate;
		this.cc = cc;
		this.exchangedate = exchangedate;
    }
}