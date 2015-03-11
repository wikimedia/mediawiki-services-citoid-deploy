#!/usr/bin/env bash

# This script generates a commit that updates the citoid submodule
# ./bin/updateSubmodule.sh        updates to master
# ./bin/updateSubmodule.sh hash   updates to specified hash


# Check that both working directories are clean
if git status -uno --ignore-submodules | grep -i changes > /dev/null
then
	echo >&2 "deploy directory must be clean"
	exit 1
fi
cd src
if git status -uno --ignore-submodules | grep -i changes > /dev/null
then
	echo >&2 "src working directory must be clean"
	exit 1
fi
cd ..

git fetch origin
# Create sync-repos branch if needed and reset it to master
git checkout -B sync-repos origin/master
git submodule update
cd src
git fetch origin

# Figure out what to set the submodule to
if [ "x$1" != "x" ]
then
	TARGET="$1"
	TARGETDESC="$1"
else
	TARGET=origin/master
	TARGETDESC="master ($(git rev-parse --short origin/master))"
fi

# Generate commit summary
NEWCHANGES=$(git log ..$TARGET --oneline --no-merges --reverse --color=never)
NEWCHANGESDISPLAY=$(git log ..$TARGET --oneline --no-merges --reverse --color=always)
COMMITMSG=$(cat <<END
Update citoid submodule to $TARGETDESC

New changes:
$NEWCHANGES
END
)
# Check out master citoid
git checkout $TARGET

# Commit
cd ..
git commit src -m "$COMMITMSG" > /dev/null
if [ "$?" == "1" ]
then
	echo >&2 "No changes"
else
	cat >&2 <<END


Created commit with changes:
$NEWCHANGESDISPLAY
END
fi
