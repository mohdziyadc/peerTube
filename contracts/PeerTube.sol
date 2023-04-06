//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract PeerTube{

    uint256 public videoCount;
    mapping(uint256 => Video) public videos;

    struct Comment {
        uint256 id;
        string message;
    }

    mapping(uint256 => Comment[]) public videoComments;
    //videoId -> likeCount
    mapping(uint256 => uint256) private likes;
    mapping(uint256 => uint256) private dislikes;
    mapping(address => bool) private userHasLiked;
    mapping(address => bool) private userHasDisliked;

    struct Video {
        uint256 id;
        string hash;
        string title;
        string description;
        string category;
        string thumbnailHash;
        uint256 date;
        address creator;
    }

    event VideoUploaded(
        uint256 id,
        string hash,
        string title,
        string description,
        string category,
        string thumbnailHash,
        uint256 date,
        address author
    );

    event CommentAdded (Comment comment);
    event Liked(address user, uint256 likeCount);
    event Disliked(address user, uint256 dislikeCount);

    function uploadVideo(string memory _videoHash, string memory _title, string memory _description, string memory _category, string memory _thumbnailHash) public {
        require(bytes(_videoHash).length > 0);
        require(bytes(_title).length > 0);
        require(msg.sender != address(0));

      
        videos[videoCount] = Video({
            id: videoCount,
            hash: _videoHash,
            title: _title,
            description: _description,
            category: _category,
            thumbnailHash: _thumbnailHash,
            date: block.timestamp,
            creator: msg.sender
        });

        videoCount++;


        emit VideoUploaded(
            videoCount,
            _videoHash,
            _title,
            _description,
            _category,
            _thumbnailHash,
            block.timestamp,
            msg.sender
        );

    }

    function addComment(uint256 _videoId, string memory _message) public {
        require(bytes(_message).length > 0, "No message");

        Comment memory comment = Comment({id: _videoId, message: _message});

        videoComments[_videoId].push(comment);
        emit CommentAdded(comment);

    }
    function addLike(uint256 _videoId) public {
        require(userHasLiked[msg.sender] == false, "You have already liked this video");
        likes[_videoId] += 1;
        if(dislikes[_videoId] != 0){
            dislikes[_videoId] -= 1;
        }
        userHasLiked[msg.sender] = true;
        userHasDisliked[msg.sender] = false;

        emit Liked(msg.sender, likes[_videoId]);

    }

    function addDislike(uint256 _videoId) public {
        require(userHasDisliked[msg.sender] == false, "You have already dislike this video");
        dislikes[_videoId] += 1;
        if(likes[_videoId] != 0){
            likes[_videoId] -= 1;
        }
        userHasDisliked[msg.sender] = true;
        userHasLiked[msg.sender] = false;
        emit Disliked(msg.sender, dislikes[_videoId]);
    }

    function getComments(uint256 _videoId) public view returns(Comment[] memory){
        return videoComments[_videoId];
    }

    function getLikes(uint256 _videoId) public view returns(uint256){
        return likes[_videoId];
    }

    function getDislikes(uint256 _videoId) public view returns(uint256){
        return dislikes[_videoId];
    }

   
}