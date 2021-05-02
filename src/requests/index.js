import axios from 'axios'
const ajax = axios.create({baseURL:'https://cloud-music-api-eight.vercel.app/'})

ajax.interceptors.response.use(resp => {
  if (resp.status === 200) {
    return resp.data
  }
  else {
    return `错误！code：${resp.status} 状态声明：${resp.statusText}`
  }
})

// 获取轮播图
const getBanners = async () => {
  const resp = await ajax.get('/banner?type=2')
  if (resp.code === 200) {
    return resp.banners
  }
}
// 获取推荐歌单
const getRecMusicList = async () => {
  const resp = await ajax.get('/personalized?limit=6')
  return resp.result
}

// 获取最新歌曲名单
const getLatstMusicList = async () => {
  const resp = await ajax.get('/personalized/newsong')
  const respLite = resp.result.reduce((res, item) => {
    const {name, id, song} = item 
    const alName = song.album.name 
    // 拿出歌手名称，如果多个歌手，就拼接一下
    let artists = song.album.artists.reduce((res, item) => {
      return res + item.name + '/'
    }, "")
    artists = artists.substring(0, artists.length - 1)
    return res.concat({songName: name, id, alName, artists})
  }, [])
  return respLite
}

// 获取搜索热词
const getHotSearch = async () => {
  const resp = await ajax.get('/search/hot')
  const respLite = resp.result.hots.reduce((res, item) => {
    return res.concat(item.first)
  }, [])
  return respLite
}

// 搜索建议
const getSuggest = async (value) => {
  const resp = await ajax.get(`/search/suggest?keywords=${value}&type=mobile`)
  const respLite = resp.result.allMatch
  return respLite
}

// 获取搜索结果
const getSearchRes = async value => {
  const resp = await ajax.get(`/search?keywords=${value}`)
  return resp.result

}

export default {
  getBanners,
  getRecMusicList,
  getLatstMusicList,
  getHotSearch,
  getSuggest,
  getSearchRes
}