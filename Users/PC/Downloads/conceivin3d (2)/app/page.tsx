
// 添加 Cube Logo 和 Color Ring Effect
<CardContent className="p-6">
  <div className="relative mb-6">
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Cube Logo */}
      <div className="w-16 h-16 bg-cyan-400 transform rotate-45 skew-x-[-45deg] skew-y-[45deg]"></div>
    </div>
    {/* Color Ring Effect */}
    <div className="w-32 h-32 rounded-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full" style={{
          background: 'conic-gradient(from 45deg, #ff00ff, #00ffff, #00ff00, #ffff00, #ff00ff)'
        }}></div>
      </div>
    </div>
  </div>

</CardContent>
