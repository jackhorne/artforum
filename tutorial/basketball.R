

data <- read.table("standings.txt", header=TRUE, sep="\t")

played = data$wins + data$losses
remaining <- 82 - played
data <- cbind(data, played, remaining)

out <- matrix(0, 10000, 8)


for(i in 1:8) {
	set.seed(i)
	out[,i] <- floor(data$wins[i] + data$remaining[i] *
		rbeta(10000, data$wins[i] + 1, data$played[i] - data$wins[i] + 1))
}

est_rank <- t(apply(out, 1, function(x) 9 - rank(x, ties.method="random")))
table(est_rank[,4])
length(est_rank[,4][est_rank[,4] < 5])

barplot(table(est_rank[,4]), xlim=c(0,9), ylim=c(0,6000), col=c(rep("green",3), rep("grey",3)))


table(out[,4])
table(out[,5])
table(out[,8])

mean(out[,4])
mean(out[,5])

sum(as.numeric(out[,4] < out[,5])) 

bars <- matrix(c(13, 0, 
                 118, 0,
                 733, 9,
         		 2474, 89, 
				 3552, 459,
				 2389, 1559,
  				 673, 2755,
				 47, 2985,
				 1, 1632, 
				 0, 470,
				 0, 42),
			   nrow=2)
			   
barplot(bars, beside=TRUE, col=c("grey", "green"), names.arg=48:58, space=c(0,.4))		