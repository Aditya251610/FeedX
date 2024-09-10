import { Models } from "appwrite"

type PostStatsProps = {
    post: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img src='/public/assets/icons/liked.svg' alt="like" width={20} height={20} onClick={() =>{}} className="cursor-pointer" />
        <p className="small-medium lg:base-mediums">200</p>
      </div>

      <div className="flex gap-2">
        <img src='/public/assets/icons/saved.svg' alt="saved" width={20} height={20} onClick={() =>{}} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default PostStats
