interface CardProps{
    book_id:string|null;
    onClose:()=>void
}

export default function QRCard(props:CardProps){
    return <div className="text-white">Hello there</div>
}