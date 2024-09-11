import { Models } from "appwrite"
import { useDeletSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "../../../lib/react-query/queriesAndMutations";
import React,{ useEffect, useState } from "react";
import { checkIsLiked } from "../../../lib/utils";
import Loader from "./Loader";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const likesList = post?.likes.map((user: Models.Document) => user.$id)
    const {data:currentUser} = useGetCurrentUser()

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false)
    const savedPostRecord = currentUser?.save.find((record: Models.Document) =>record.post.$id === post?.$id)

    const {mutate: likePost} = useLikePost()
    const {mutate: savePost, isPending: isSavingPost} = useSavePost()
    const {mutate: deletSavePost, isPending: isDeletingSaved} = useDeletSavedPost()

    useEffect(()=>{
        setIsSaved(savedPostRecord? true: false)
    }, [currentUser])
    

    const handelLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId)
        if(hasLiked){
            newLikes = newLikes.filter((id) => id!== userId);
        } else{
            newLikes.push(userId)
        }

        setLikes(newLikes);
        likePost({ postId: post?.$id || '', likesArray: newLikes })
    }
    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        if(savedPostRecord){
            setIsSaved(false);
            deletSavePost(savedPostRecord.$id)
        } else{
            savePost({ postId: post?.$id || '', userId })
            setIsSaved(true)
        }
    }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img 
            src={`${checkIsLiked(likes, userId)? '/public/assets/icons/liked.svg' : '/public/assets/icons/like.svg'}`} 
            alt="like" 
            width={20} 
            height={20} 
            onClick={handelLikePost} 
            className="cursor-pointer"
        />
        <p className="small-medium lg:base-mediums">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? <Loader />:
        <img 
            src= {`${isSaved ? '/public/assets/icons/saved.svg' : '/public/assets/icons/save.svg'}`} 
            alt="saved" 
            width={20} 
            height={20} 
            onClick={handleSavePost} 
            className="cursor-pointer"
        />}
      </div>
    </div>
  )
}

export default PostStats
