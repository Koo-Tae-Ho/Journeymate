const tComment = require('../models/commentModel');

// 커뮤니티 댓글 가져오기
async function getComments(req, res) {
  const tpostId = req.params.tpostID; // URL에서 게시글 ID 가져옴
  try {
    const comments = await tComment.tComment.findAll({ where: { tpostID: tpostId } });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '댓글을 가져오는 동안 오류가 발생하였습니다.' });
  }
}

//커뮤니티 댓글 작성
async function addComment(req, res) {
  const tpostId = req.params.tpostID; // URL에서 가져옴
  console.log(req.body);
  console.log(tpostId);
  try {
    const comment = await tComment.tComment.create({
      tcommentId : req.body.tcommentId, 
      userID : req.decode.userID, 
      contents : req.body.contents, 
      tpostID : tpostId,
      commentDate : new Date()
    });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '댓글을 작성하는 동안 오류가 발생하였습니다.' });
  }
}

//커뮤니티 댓글 삭제
// commentController.js
async function deleteComment(req, res) {
  const tcommentId = req.body.tcommentId;
  // const userID = req.body.userID; // 요청 본문에서 userID를 가져오는 대신 인증 미들웨어에서 설정한 값을 사용합니다.

  try {
    // 댓글을 찾아서 가져옵니다.
    const comment = await tComment.tComment.findOne({ where: { tcommentId: tcommentId } });

    // 댓글이 없거나 사용자 ID가 일치하지 않는 경우 오류를 반환합니다.
    if (!comment || comment.userID !== req.decode.userID) { // req.decode.userID를 사용해 요청을 보낸 사용자와 댓글 작성자를 비교합니다.
      return res.status(403).json({ message: 'You do not have permission to delete this comment.' });
    }

    // 댓글을 삭제합니다.
    await tComment.tComment.destroy({ where: { tcommentId: tcommentId } });
    res.status(200).json({ message: '댓글이 정상적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '댓글을 삭제하는 동안 오류가 발생하였습니다.' });
  }
}





//동행인 댓글 작성
async function companionAddComment(req, res) {
  const { ccommentId, userId, contents, cpostID } = req.body;
  try {
    const comment = await cComment.create({ ccommentId, userId, contents, cpostID });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '동행인 댓글을 작성하는 동안 오류가 발생하였습니다.' });
  }
}
//커뮤니티 댓글 삭제
async function companionDeleteComment(req, res) {
  const { ccommentId } = req.body; //사용자 ID를 인증 받지 않은 코드입니다. 추후에 수정하겠습니다.

  try {
    const comment = await cComment.destroy({ where: { ccommentId: ccommentId } });
    res.status(200).json({ message: '동행인 댓글이 정상적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '동행인 댓글을 삭제하는 동안 오류가 발생하였습니다.' });
  }
}

module.exports = { addComment, deleteComment, getComments, companionAddComment,companionDeleteComment };
