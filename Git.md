## Setup new project
open repository in hosting website
in the folder
> git init
> git add .
> git commit -m "my first commit"
> git remote add origin https://project-repo-url
> git push origin -u master

## Commands
switch branch
    git checkout branchName
switch to a new branch
    git checkout -b branchName
switch to a commit
    git checkout commit-hash-code

upload
    git add .
    git commit -m "commit name"
        ** edit commit name
            git commit --amend -m "new commit name"
    git push origin branchName
        ** to force push (only when necessary)
            git push --force
    
clear (to the last commit status)
    git revert
    git revert --hard
        or saving in local the changes
            git stash

reset-rollback (take the branch back to a certain commit)
    git log
        ** copy the target commit hash
            ** can copy only the first 7 letters
    git reset --hard commit-hash
    

branch history
    git log
    git log --oneline (to see in one line)

pull & merge
    git checkout dev/master
    git pull (updating the branch with the lastest commit)
    git pull origin/targetBranch
    ^ fast-forward the master/dev to the commit of the target-branch
    
    *** second way
    git checkout ratgerBranch
    git merge master
    
    ***to abort merge
    git merge --abort
    git stash/revert (to go back before the changes)


# Rebase
git rebase info
    git rebase -i HEAD~10 (will show all 10 commits ago)
        // ^ opens editor with commands
    ** other rebase commands
    git rebase --continue
    git rebase --abort

git rebase for clearing history (renewing the commits of the branch, change commits relations)
    git checkout featureBranch
    git rebase sourceBranch (usually master/dev)
    git log (the commits will have new identifires)
git merge with a rebase (don't do on public branches, the history will only have 1 branch)
    git rebase master/dev (from new-branch, will check if there's no conflicts with master)
    git checkout master/dev
    git merge new-branch
    
    
# Save password and username
    git config credential.helper cache
    git push http://example.com/repo.git
        Username: <type your username>
        Password: <type your password>
        
    *** to save for 5 minutes
         git config credential.helper 'cache --timeout=300'