const { NUMBER,Op } = require('sequelize');
const Group = require('../models/group');
groupMembers = require('../models/group_members');

exports.createGroup =( req,res,next) =>{
    const groupName = req.body.groupName;
    console.log('=======',req.user.id)

    try{

        Group.create({groupName})
        .then(group =>{
            return group.addUser(req.user,{ through:{ isadmin:true } });
        })
        .then(group_member =>{
            console.log(group_member)
            res.status(200).json({ groupName , group_member })
            
        })
        .catch(err => console.log(err)); 
    }catch(err){
        console.log(err);
    }
}


// getting all groups the current user assoiciated with
exports.getAll = async ( req,res,next) =>{
    
    console.log('groups list request')
    try{

        await req.user.getGroups({attributes:['id','groupName']})
        .then((groups)=>{
            const groupsData =[];
            groups.forEach(group=>{
                groupsData.push({id:group.id,groupName:group.groupName})
            })
            res.status(201).json({groups:groupsData});
        })
        .catch(err => console.log(err))
    }catch(err){
        console.log(err);
    }
}


// adding member to group
exports.addMember =(req,res,next)=>{
    const groupId  = parseInt(req.body.groupId);
    const userId  = parseInt(req.body.userId);
    
    console.log('===== add member ==',groupId)
    try{
        let fetched_group;
        Group.findAll({where:{id:groupId}})
        .then(group =>{
            fetched_group=group[0];
            return group[0].getUsers({where:{id:userId}})
        })
        .then(groupMembers =>{
            //console.log(groupMembers)
            if(groupMembers.length>0){
                console.log('this user is already exist in this group')
                res.status(203).json({msg:'this user is already exist in this gorup'})
            }else{
               fetched_group.addUser(userId)
               .then(new_member=>{
                //console.log(new_member)
                res.status(201).json({msg:'successfully added to group',data:new_member})
                
                })
                .catch(err =>{console.log(err)})
            }
        })
        .catch(err =>{console.log(err)})
    }catch(err){
        console.log(err);
    }
}


exports.remove_member =(req,res,next)=>{
    const groupId = parseInt(req.body.groupId);
    const userId = parseInt(req.body.userId);
    console.log('==== remove member ==',groupId,userId)

    Group.findOne({where:{id:groupId}})
    .then(group =>{
        //console.log(group)
        return group.getUsers({where:{id:userId}})
    })  
    .then(fetched_user =>{
        //console.log(fetched_user)
        if(fetched_user.length>0){

            return fetched_user[0].groupMembers.destroy();
        }else{
            res.status(404).json({msg:'user not found in this group'})
        }
    })
    .then(result =>{
        res.status(200).json({msg:'successfully removed this user from group'})
    })
    .catch(err => console.log(err))
}

// getiing all group members
exports.get_all_members = (req,res,next) =>{
    const groupId = req.query.groupId;

    let group_member_details= [];

    Group.findOne({where:{id: groupId}})
    .then(group =>{
        console.log(group);
        return group.getUsers({ through:{isadmin:{ [Op.in]:[true,false] } } })
    })
    .then( async (groupMembers) =>{
        console.log(groupMembers[0].groupMembers)
        await groupMembers.forEach(member =>{
            group_member_details.push(member.groupMembers);
        })
        console.log(group_member_details)
        res.send(group_member_details)
    })        
    .catch(err => {console.log(err)
        res.status(404).json({msg:'something went wrong'})
    })

}

// adding existing user as admin to group
exports.add_admin =(req,res,next)=>{
    const groupId = parseInt(req.body.groupId);
    const userId = parseInt(req.body.userId);

    let fetched_group;
    Group.findOne({where:{id:groupId}})
    .then(group =>{
        fetched_group=group;
        return group.getUsers({where:{id:userId}})
    })
    .then(fetched_user =>{
        return fetched_group.addUser(fetched_user,{
            through:{isadmin:true}
        })
    })
    .then(updated_admin =>{
        console.log(updated_admin)
        res.status(200).json({msg:'successfully added this user as admin to this group'})
    })
    .catch(err => console.log(err))
}

// removing existing user admin status to normal user
exports.remove_admin =(req,res,next) =>{
    const groupId = parseInt(req.body.groupId);
    const userId = parseInt(req.body.userId);

    let fetched_group;
    Group.findOne({where:{id:groupId}})
    .then(group =>{
        fetched_group=group;
        return group.getUsers({where:{id:userId}})
    })
    .then(fetched_user =>{
        return fetched_group.addUser(fetched_user,{
            through:{isadmin:false}
        })
    })
    .then(updated_admin =>{
        console.log(updated_admin)
        res.status(200).json({msg:'successfully removed this user as admin to this group'})
    })
    .catch(err => console.log(err))
}
