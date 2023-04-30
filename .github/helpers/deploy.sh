#!/usr/bin/env bash

# this script deploys a desk to a ship from a github repository
# assumes gcloud credentials are loaded and gcloud installed.

repo=$1
desk=$2
ship=$3
ref=${4:-master}
folder=$ship/$desk

set -e
set -o pipefail
cmdfile=$(mktemp "${TMPDIR:-/tmp/}build.XXXXXXXXX")
# mktemp only used for generating a random folder name below
cmds='
source_repo=$(mktemp --dry-run /tmp/repo.build.XXXXXXXXX)
git clone --depth 1 --branch '$ref' git@github.com:'$repo'.git $source_repo
urbit_repo=$(mktemp --dry-run /tmp/repo.urbit.XXXXXXXXX)
git clone --depth 1 git@github.com:urbit/urbit.git $urbit_repo -b '$URBIT_REPO_TAG' --single-branch
cd $source_repo
cd /home/urb || return
curl -s --data '\''{"source":{"dojo":"+hood/mount %'$desk'"},"sink":{"app":"hood"}}'\'' http://localhost:12321
rsync -avL --delete $urbit_repo/pkg/base-dev/ '$folder'
rsync -avL $source_repo/desk/ '$folder'
curl -s --data '\''{"source":{"dojo":"+hood/commit %'$desk'"},"sink":{"app":"hood"}}'\'' http://localhost:12321
rm -rf $source_repo
rm -rf $urbit_repo
'
echo "$cmds" >> "$cmdfile"
sshpriv=$(mktemp "${TMPDIR:-/tmp/}ssh.XXXXXXXXX")
sshpub=$sshpriv.pub
echo "$SSH_PUB_KEY" >> "$sshpub"
echo "$SSH_SEC_KEY" >> "$sshpriv"
chmod 600 $sshpub
chmod 600 $sshpriv

ssh kaladin@urbit.hmiller.dev 'bash -s' < "$cmdfile" -i "$sshpriv" -o "StrictHostKeyChecking=no"

echo "OTA performed for $desk on $ship"