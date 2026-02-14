"use client"

const FeatureGrid = ({id}) => {

    const features=[
        {
            
            icon:'🔒',
            title:'Private & Secure',
            description:'Your bookmarks are private. Only you can see them.'
        },
        {
            icon:'⚡',
            title:'Instant Updates',
            description:'Bookmarks appear instantly across all your tabs.'
        },
        {
            icon:'🌍',
            title:'Anywhere Access',
            description:'Sign in from any device to access your bookmarks.'
        }
    ]

  return (
     <div className="grid md:grid-cols-3 gap-6 mt-12">
          {features.map((items,index)=>(
            // <div key={index} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-xl  hover:transform hover:scale-105 hover:translate-y-[-10px] transition-transform duration-200">
            //     <p className="text-3xl text-center mb-3">{items.icon}</p>
            //     <h3 className="font-semibold text-center mb-2">{items.title}</h3>
            //     <p className="text-gray-600 text-center text-sm">{items.description}</p>
            // </div>
            <div id={id} className="relative rounded-xl overflow-hidden">
  
            <div className={`absolute inset-0 
                bg-[#4296FF] 
                animate-spin 
                [animation-duration:10s] rounded-full blur-2xl`}>
            </div>
            <div className="relative m-[2px] bg-white rounded-xl p-6">
                <p className="text-3xl text-center mb-3">{items.icon}</p>
                <h3 className="font-semibold text-center mb-2">{items.title}</h3>
                <p className="text-gray-600 text-center text-sm">
                {items.description}
                </p>
        </div>

</div>
          ))}
        </div>
  )
}

export default FeatureGrid