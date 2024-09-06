const formatCurrency = (jumlah:number):string=>{
  return new Intl.NumberFormat('id-ID',{
    currency: 'IDR',
    style: 'currency'
  }).format(jumlah)
}

export default formatCurrency