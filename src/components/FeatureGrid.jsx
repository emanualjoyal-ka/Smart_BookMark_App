

const FeatureGrid = () => {

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
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                <div className="text-3xl mb-3">{items.icon}</div>
                <h3 className="font-semibold mb-2">{items.title}</h3>
                <p className="text-gray-600 text-sm">{items.description}</p>
            </div>
          ))}
        </div>
  )
}

export default FeatureGrid